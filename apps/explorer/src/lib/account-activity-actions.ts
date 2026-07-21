"use server";

import { getServices } from "@/lib/services";
import {
  type AccountActivityData,
  normalizeActivityParams,
} from "@/lib/account-activity";

/**
 * Server action that returns one page of account activity. Called from the
 * client so tab/page/pageSize changes update only the activity section without
 * re-running the whole account page (and its balance/delegation lookups).
 */
export async function fetchAccountActivity(input: {
  address: string;
  tab: string;
  page: number;
  pageSize: number;
}): Promise<AccountActivityData> {
  const { tab, page, pageSize, offset } = normalizeActivityParams(input);
  const { accountService } = getServices();

  try {
    if (tab === "messages") {
      const rows = await accountService.getAccountMessages(input.address, {
        limit: pageSize + 1,
        offset,
      });
      const hasNextPage = rows.length > pageSize;
      return {
        tab,
        page,
        pageSize,
        hasNextPage,
        transactions: [],
        messages: hasNextPage ? rows.slice(0, pageSize) : rows,
        error: false,
      };
    }

    const rows = await accountService.getAccountTransactions(input.address, {
      limit: pageSize + 1,
      offset,
    });
    const hasNextPage = rows.length > pageSize;
    return {
      tab,
      page,
      pageSize,
      hasNextPage,
      transactions: hasNextPage ? rows.slice(0, pageSize) : rows,
      messages: [],
      error: false,
    };
  } catch {
    return {
      tab,
      page,
      pageSize,
      hasNextPage: false,
      transactions: [],
      messages: [],
      error: true,
    };
  }
}
