import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function CreateIbcClientMessage({ msg }: { msg: ContentMessage }) {
  const clientState = msg.client_state as { chain_id?: string; ["@type"]?: string } | undefined;
  const signer = (msg.signer ?? msg.authority) as string | undefined;
  const chainId = clientState?.chain_id;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">
        Create IBC client{chainId ? ` for ${chainId}` : ""}
      </span>
      {chainId && (
        <MessageRow label="Chain">
          <span className="font-mono">{chainId}</span>
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
