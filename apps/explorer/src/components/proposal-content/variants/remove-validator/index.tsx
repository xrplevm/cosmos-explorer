import { ProposalContent } from "../../shared/proposal-content-parts";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface RemoveValidatorValue extends ProposalContentItem {
  authority?: string;
  sender?: string;
  validator_address?: string;
  validatorAddress?: string;
  moniker?: string;
  description?: {
    moniker?: string;
  };
}

function ValidatorRow({
  moniker,
  address,
  colorClass,
}: {
  moniker: string;
  address: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorClass}`}
      >
        {moniker.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{moniker}</p>
        {address.length > 0 && (
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            {address}
          </p>
        )}
      </div>
    </div>
  );
}

export function RemoveValidatorContent({ proposal }: ProposalContentViewProps) {
  const messages = Array.isArray(proposal.content)
    ? (proposal.content as RemoveValidatorValue[])
    : [];

  if (messages.length === 0) {
    return (
      <ProposalContent.Card title="Remove Validator">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
      </ProposalContent.Card>
    );
  }

  // Common authority (usually the same for all messages)
  const authority = messages[0]?.authority ?? messages[0]?.sender;

  return (
    <ProposalContent.Card title="Remove Validator">
      <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
      <ProposalContent.Row label={`Validators (${messages.length})`}>
        <div className="space-y-2">
          {messages.map((msg, i) => {
            const moniker =
              msg.moniker ?? msg.description?.moniker ?? "Unknown";
            const address =
              msg.validator_address ?? msg.validatorAddress ?? "";
            return (
              <ValidatorRow
                key={`${address}-${i}`}
                moniker={moniker}
                address={address}
                colorClass="bg-red-500/15 text-red-400"
              />
            );
          })}
        </div>
      </ProposalContent.Row>
      <ProposalContent.AddressField label="Authority" address={authority} />
    </ProposalContent.Card>
  );
}
