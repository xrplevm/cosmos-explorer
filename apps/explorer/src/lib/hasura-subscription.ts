// Minimal graphql-transport-ws client: the consensus view only needs a
// "new block" signal to trigger a server-side refetch, not a full GraphQL-WS lib.

const LATEST_HEIGHT_SUBSCRIPTION =
  "subscription ConsensusTip { block(limit: 1, order_by: { height: desc }) { height } }";

const MAX_BACKOFF_MS = 30000;

interface WsMessage {
  type: string;
  id?: string;
  payload?: { data?: { block?: { height?: number | string }[] } };
}

function parseMessage(data: unknown): WsMessage | null {
  if (typeof data !== "string") return null;
  try {
    return JSON.parse(data) as WsMessage;
  } catch {
    return null; // ignore malformed frames
  }
}

/** `onHeight` fires on every push, including the current value on subscribe. */
export function subscribeLatestHeight(
  url: string,
  onHeight: (height: number) => void,
  onStatus?: (connected: boolean) => void,
): { close: () => void } {
  let ws: WebSocket | null = null;
  let closed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let retry = 0;

  const connect = (): void => {
    if (closed) return;
    ws = new WebSocket(url, "graphql-transport-ws");

    ws.onopen = () => {
      ws?.send(JSON.stringify({ type: "connection_init" }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const msg = parseMessage(event.data);
      if (!msg) return;

      if (msg.type === "connection_ack") {
        retry = 0;
        onStatus?.(true);
        ws?.send(
          JSON.stringify({
            id: "1",
            type: "subscribe",
            payload: { query: LATEST_HEIGHT_SUBSCRIPTION },
          }),
        );
      } else if (msg.type === "ping") {
        ws?.send(JSON.stringify({ type: "pong" }));
      } else if (msg.type === "next") {
        const height = Number(msg.payload?.data?.block?.[0]?.height);
        if (Number.isFinite(height)) onHeight(height);
      } else if (msg.type === "error" || msg.type === "complete") {
        // The subscription itself failed or ended (e.g. rejected by Hasura)
        // while the socket stays open — close it so onclose reports the drop
        // and the reconnect/fallback-poll path takes over.
        ws?.close();
      }
    };

    ws.onclose = () => {
      onStatus?.(false);
      if (closed) return;
      const delay = Math.min(1000 * 2 ** retry, MAX_BACKOFF_MS);
      retry += 1;
      reconnectTimer = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws?.close(); // triggers onclose → backoff reconnect
    };
  };

  connect();

  return {
    close: () => {
      closed = true;
      clearTimeout(reconnectTimer);
      ws?.close();
    },
  };
}
