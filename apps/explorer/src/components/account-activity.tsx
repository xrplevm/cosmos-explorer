"use client";

import { useRef, useState, useTransition } from "react";
import { Pagination } from "@cosmos-explorer/ui/pagination";
import { AccountActivityTabs } from "@/components/account-activity-tabs";
import { AccountMessagesCard } from "@/components/account-messages-card";
import { AccountTransactionsCard } from "@/components/account-transactions-card";
import {
  type AccountActivityData,
  type AccountActivityTab,
} from "@/lib/account-activity";
import { fetchAccountActivity } from "@/lib/account-activity-actions";

/**
 * Client-side activity section: switching tab, page, or page size fetches only
 * this section via a server action and swaps it in place — the surrounding
 * account page (balances, delegations, rewards) is never re-fetched.
 */
export function AccountActivity({
  address,
  initial,
}: {
  address: string;
  initial: AccountActivityData;
}) {
  const [data, setData] = useState<AccountActivityData>(initial);
  const [isPending, startTransition] = useTransition();
  // Ignore out-of-order responses from rapid clicks: only the latest wins.
  const requestId = useRef(0);

  function update(next: {
    tab: AccountActivityTab;
    page: number;
    pageSize: number;
  }) {
    const id = ++requestId.current;

    // Keep the URL shareable/refreshable without triggering a navigation.
    const params = new URLSearchParams({
      tab: next.tab,
      page: String(next.page),
      pageSize: String(next.pageSize),
    });
    window.history.replaceState(null, "", `?${params.toString()}`);

    startTransition(async () => {
      const result = await fetchAccountActivity({ address, ...next });
      if (id === requestId.current) {
        setData(result);
      }
    });
  }

  const rowCount =
    data.tab === "messages" ? data.messages.length : data.transactions.length;
  const showPagination = rowCount > 0 || data.page > 1;

  return (
    <div className="space-y-6">
      <AccountActivityTabs
        active={data.tab}
        onSelect={(tab) => {
          if (tab !== data.tab) {
            update({ tab, page: 1, pageSize: data.pageSize });
          }
        }}
      />

      <div
        className={`space-y-6 transition-opacity ${isPending ? "opacity-60" : ""}`}
        aria-busy={isPending}
      >
        {data.tab === "messages" ? (
          <AccountMessagesCard messages={data.messages} error={data.error} />
        ) : (
          <AccountTransactionsCard
            transactions={data.transactions}
            error={data.error}
          />
        )}

        {showPagination && (
          <Pagination
            currentPage={data.page}
            pageSize={data.pageSize}
            hasNextPage={data.hasNextPage}
            isPending={isPending}
            onPageChange={(page) => {
              update({ tab: data.tab, page, pageSize: data.pageSize });
            }}
            onPageSizeChange={(pageSize) => {
              update({ tab: data.tab, page: 1, pageSize });
            }}
          />
        )}
      </div>
    </div>
  );
}
