import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function DefaultMessage({ msg }: { msg: ContentMessage }) {
  const address = msg.authority ?? msg.sender ?? msg.validator_address ?? msg.validatorAddress;

  if (!address) return null;

  return (
    <div className="space-y-1.5">
      <MessageRow label="Address">
        <AddressValue address={address} link />
      </MessageRow>
    </div>
  );
}
