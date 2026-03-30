import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue, ValidatorChip } from "./shared";

export function RemoveValidatorMessage({ msg }: { msg: ContentMessage }) {
  const moniker = msg.moniker ?? msg.description?.moniker;
  const address = msg.validator_address ?? msg.validatorAddress;
  const authority = msg.authority ?? msg.sender;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">Remove validator</span>
      {moniker && (
        <MessageRow label="Validator">
          <ValidatorChip moniker={moniker} colorClass="bg-red-500/15 text-red-400" />
        </MessageRow>
      )}
      {address && (
        <MessageRow label="Address">
          <AddressValue address={address} link />
        </MessageRow>
      )}
      {authority && (
        <MessageRow label="Authority">
          <AddressValue address={authority} link />
        </MessageRow>
      )}
    </div>
  );
}
