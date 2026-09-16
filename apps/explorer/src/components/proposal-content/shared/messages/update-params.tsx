import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function UpdateParamsMessage({ msg }: { msg: ContentMessage }) {
  const authority = (msg.signer ?? msg.authority) as string | undefined;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">Update parameters</span>
      {authority && (
        <MessageRow label="Authority">
          <AddressValue address={authority} link />
        </MessageRow>
      )}
    </div>
  );
}
