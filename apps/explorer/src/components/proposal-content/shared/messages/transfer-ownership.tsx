import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function TransferOwnershipMessage({ msg }: { msg: ContentMessage }) {
  const from = msg.authority ?? msg.sender ?? (msg.old_owner as string | undefined);
  const to = (msg.new_owner as string | undefined) ?? msg.recipient;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">Transfer ownership</span>
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
    </div>
  );
}
