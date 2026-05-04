import type { ContentMessage } from "../message-helpers";
import { MessageRow, AddressValue } from "./shared";

export function RecoverClientMessage({ msg }: { msg: ContentMessage }) {
  const subjectClientId = msg.subject_client_id as string | undefined;
  const substituteClientId = msg.substitute_client_id as string | undefined;
  const signer = (msg.signer ?? msg.authority) as string | undefined;

  return (
    <div className="space-y-1.5">
      <span className="text-sm">
        Recover IBC client
        {subjectClientId ? ` ${subjectClientId}` : ""}
        {substituteClientId ? ` using ${substituteClientId}` : ""}
      </span>
      {subjectClientId && (
        <MessageRow label="Subject">
          <span className="font-mono">{subjectClientId}</span>
        </MessageRow>
      )}
      {substituteClientId && (
        <MessageRow label="Substitute">
          <span className="font-mono">{substituteClientId}</span>
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
