import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function SoftwareUpgradeMessage({ msg }: { msg: ContentMessage }) {
  const plan = msg.plan;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">
        Software upgrade{plan?.name ? ` to ${plan.name}` : ""}
      </span>
      {plan?.name && <MessageRow label="Name"><span>{plan.name}</span></MessageRow>}
      {plan?.height && (
        <MessageRow label="Height">
          <span className="font-mono">{Number(plan.height).toLocaleString()}</span>
        </MessageRow>
      )}
      {msg.authority && (
        <MessageRow label="Authority">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
    </div>
  );
}
