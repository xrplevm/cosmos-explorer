import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue, ValidatorChip } from "./shared";

export function AddValidatorMessage({ msg }: { msg: ContentMessage }) {
  const moniker = msg.moniker ?? msg.description?.moniker;
  const address = msg.validator_address ?? msg.validatorAddress;
  const authority = msg.authority ?? msg.sender;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">Add validator</span>
      {moniker && (
        <MessageRow label="Validator">
          <ValidatorChip moniker={moniker} colorClass="bg-green-500/15 text-green-400" />
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
