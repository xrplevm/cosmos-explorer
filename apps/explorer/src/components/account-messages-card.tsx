import type { AccountMessageSummary } from "@cosmos-explorer/core";
import { AccountActivityList } from "@/components/account-activity-list";
import {
  activityPageCount,
  formatActivityCount,
} from "@/components/account-activity";

export async function AccountMessagesCard({
  messagesPromise,
  countPromise,
  page,
}: {
  messagesPromise: Promise<AccountMessageSummary[]>;
  countPromise: Promise<number>;
  page: number;
}) {
  // A failed count degrades the pager but never discards loaded messages.
  const [messages, count] = await Promise.all([
    messagesPromise.catch(() => null),
    countPromise.catch(() => null),
  ]);

  if (!messages) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Couldn&apos;t load messages for this account. Please try again later.
      </p>
    );
  }

  const rows = messages.map((message) => ({
    // One row per message, so the tx hash alone isn't a unique key.
    key: `${message.hash}-${String(message.index)}`,
    hash: message.hash,
    type: message.type,
    isEthereum: message.type === "EthereumTx",
    success: message.success,
    height: message.height,
    timestamp: message.timestamp,
  }));

  return (
    <>
      {count !== null && (
        <p className="mb-3 text-sm text-muted-foreground">
          {formatActivityCount(count, "message")}
        </p>
      )}
      <AccountActivityList
        rows={rows}
        page={page}
        pageCount={count === null ? null : activityPageCount(count)}
        pageParam="msgPage"
        emptyLabel="No messages found."
        paginationLabel="Messages pagination"
      />
    </>
  );
}
