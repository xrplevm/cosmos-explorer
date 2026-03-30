import { ProposalContent } from "../../shared/proposal-content-parts";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface AddValidatorValue extends ProposalContentItem {
  authority?: string;
  sender?: string;
  validator_address?: string;
  validatorAddress?: string;
  moniker?: string;
  description?: {
    moniker?: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    securityContact?: string;
    details?: string;
  };
  commission?: {
    rate?: string;
    max_rate?: string;
    maxRate?: string;
    max_change_rate?: string;
    maxChangeRate?: string;
  };
  min_self_delegation?: string;
  minSelfDelegation?: string;
}

function ValidatorRow({
  moniker,
  address,
  details,
  colorClass,
}: {
  moniker: string;
  address: string;
  details?: string;
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
        {details && details.length > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {details}
          </p>
        )}
      </div>
    </div>
  );
}

export function AddValidatorContent({ proposal }: ProposalContentViewProps) {
  const messages = Array.isArray(proposal.content)
    ? (proposal.content as AddValidatorValue[])
    : [];

  if (messages.length === 0) {
    return (
      <ProposalContent.Card title="Add Validator">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
      </ProposalContent.Card>
    );
  }

  const authority = messages[0]?.authority ?? messages[0]?.sender;

  // Single validator — show full details
  if (messages.length === 1) {
    const content = messages[0];
    const desc = content.description;
    const moniker = content.moniker ?? desc?.moniker;
    const commission = content.commission;

    return (
      <ProposalContent.Card title="Add Validator">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.TextField label="Moniker" value={moniker} />
        <ProposalContent.AddressField
          label="Validator Address"
          address={content.validator_address ?? content.validatorAddress}
        />
        <ProposalContent.AddressField label="Authority" address={authority} />
        <ProposalContent.MonoField label="Identity" value={desc?.identity} />
        <ProposalContent.TextField label="Website" value={desc?.website} />
        <ProposalContent.TextField
          label="Security Contact"
          value={desc?.security_contact ?? desc?.securityContact}
        />
        <ProposalContent.TextField label="Validator Details" value={desc?.details} />
        {commission != null && (
          <ProposalContent.Row label="Commission">
            <div className="space-y-1 text-xs">
              {commission.rate != null && (
                <div>Rate: <span className="font-mono">{commission.rate}</span></div>
              )}
              {(commission.max_rate ?? commission.maxRate) != null && (
                <div>Max Rate: <span className="font-mono">{commission.max_rate ?? commission.maxRate}</span></div>
              )}
              {(commission.max_change_rate ?? commission.maxChangeRate) != null && (
                <div>Max Change Rate: <span className="font-mono">{commission.max_change_rate ?? commission.maxChangeRate}</span></div>
              )}
            </div>
          </ProposalContent.Row>
        )}
        <ProposalContent.MonoField
          label="Min Self Delegation"
          value={content.min_self_delegation ?? content.minSelfDelegation}
        />
      </ProposalContent.Card>
    );
  }

  // Multiple validators — show compact list
  return (
    <ProposalContent.Card title="Add Validator">
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
                details={msg.description?.details}
                colorClass="bg-green-500/15 text-green-400"
              />
            );
          })}
        </div>
      </ProposalContent.Row>
      <ProposalContent.AddressField label="Authority" address={authority} />
    </ProposalContent.Card>
  );
}
