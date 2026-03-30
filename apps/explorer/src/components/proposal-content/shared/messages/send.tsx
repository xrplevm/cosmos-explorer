import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue, CoinValue } from "./shared";

export function SendMessage({ msg }: { msg: ContentMessage }) {
  const from = msg.authority ?? msg.sender ?? (msg.from_address as string | undefined);
  const to = msg.recipient ?? (msg.to_address as string | undefined);
  const coins = Array.isArray(msg.amount) ? msg.amount : undefined;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">Send</span>
      {from && (
        <MessageRow label="From">
          <AddressValue address={from} link />
        </MessageRow>
      )}
      {to && (
        <MessageRow label="To">
          <AddressValue address={to} link />
        </MessageRow>
      )}
      {coins && coins.length > 0 && (
        <MessageRow label="Amount">
          <CoinValue coins={coins} />
        </MessageRow>
      )}
    </div>
  );
}
