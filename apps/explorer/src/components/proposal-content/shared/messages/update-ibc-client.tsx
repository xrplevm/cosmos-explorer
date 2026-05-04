import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function UpdateIbcClientMessage({ msg }: { msg: ContentMessage }) {
  const clientId = msg.client_id as string | undefined;
  const signer = (msg.signer ?? msg.authority) as string | undefined;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">
        Update IBC client{clientId ? ` ${clientId}` : ""}
      </span>
      {clientId && (
        <MessageRow label="Client">
          <span className="font-mono">{clientId}</span>
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
