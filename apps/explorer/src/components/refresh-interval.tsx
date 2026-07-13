"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscribeLatestHeight } from "@/lib/hasura-subscription";

// Refreshes on hidden tabs are skipped — the whole route re-runs on each
// refresh, so there is no point paying for it off-screen.
export function RefreshInterval({
  graphqlWs,
  intervalMs = 6000,
}: {
  graphqlWs?: string;
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    let lastHeight = 0;
    let wsConnected = false;

    const refresh = () => {
      if (document.visibilityState !== "hidden") router.refresh();
    };

    const sub = graphqlWs
      ? subscribeLatestHeight(
          graphqlWs,
          (height) => {
            // Refresh on the first push too — the page may already be stale by
            // the time the socket connects.
            if (height > lastHeight) {
              lastHeight = height;
              refresh();
            }
          },
          (connected) => {
            wsConnected = connected;
          },
        )
      : null;

    // Fallback only: skip while the subscription is connected.
    const id = setInterval(() => {
      if (!wsConnected) refresh();
    }, intervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      sub?.close();
    };
  }, [router, graphqlWs, intervalMs]);

  return null;
}
