import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function IbcSoftwareUpgradeMessage({ msg }: { msg: ContentMessage }) {
  const plan = msg.plan as { name?: string; height?: string } | undefined;
  const signer = (msg.signer ?? msg.authority) as string | undefined;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">
        IBC software upgrade{plan?.name ? ` to ${plan.name}` : ""}
      </span>
      {plan?.name && (
        <MessageRow label="Name">
          <span>{plan.name}</span>
        </MessageRow>
      )}
      {plan?.height && (
        <MessageRow label="Height">
          <span className="font-mono">{Number(plan.height).toLocaleString()}</span>
        </MessageRow>
      )}
      {signer && (
        <MessageRow label="Signer">
          <AddressValue address={signer} link />
        </MessageRow>
      )}
    </div>
  );
}
