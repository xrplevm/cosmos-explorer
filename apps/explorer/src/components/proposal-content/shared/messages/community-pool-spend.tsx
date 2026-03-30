import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue, CoinValue } from "./shared";

export function CommunityPoolSpendMessage({ msg }: { msg: ContentMessage }) {
  const recipient = msg.recipient;
  const coins = Array.isArray(msg.amount) ? msg.amount : undefined;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">Community pool spend</span>
      {msg.authority && (
        <MessageRow label="From">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
      {recipient && (
        <MessageRow label="To">
          <AddressValue address={recipient} link />
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
