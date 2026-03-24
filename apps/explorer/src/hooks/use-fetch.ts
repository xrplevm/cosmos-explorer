"use client";

import { useEffect, useRef, useState } from "react";

interface UseFetchState<TData> {
  data: TData | null;
  error: Error | null;
  status: "loading" | "ready" | "error";
}

/**
 * `requestKey` identifies the remote resource. Change it whenever the request inputs change.
 */
export function useFetch<TData>(
  requestKey: string,
  load: () => Promise<TData>,
): UseFetchState<TData> {
  const [state, setState] = useState<UseFetchState<TData>>({
    data: null,
    error: null,
    status: "loading",
  });
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let cancelled = false;

    setState({
      data: null,
      error: null,
      status: "loading",
    });

    void loadRef.current()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setState({
          data,
          error: null,
          status: "ready",
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setState({
          data: null,
          error: error instanceof Error ? error : new Error("Request failed"),
          status: "error",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  return state;
}
