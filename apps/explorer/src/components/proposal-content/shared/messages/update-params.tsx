import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function UpdateParamsMessage({ msg }: { msg: ContentMessage }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Update parameters</span>
      {msg.authority && (
        <MessageRow label="Authority">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
    </div>
  );
}
