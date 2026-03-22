import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface ParamChange {
  subspace?: string;
  key?: string;
  value?: string;
}

interface ParameterChangeValue extends ProposalContentItem {
  changes?: ParamChange[];
  authority?: string;
}

export function ParameterChangeContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as ParameterChangeValue | undefined)
    : undefined;
  const changes = content?.changes;

  return (
    <div className="space-y-6">
      <ProposalContent.Card title="Parameter Change">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.AddressField label="Authority" address={content?.authority} />
        {Array.isArray(changes) && changes.length > 0 && (
          <ProposalContent.Row label="Changes">
            <div className="space-y-3">
              {changes.map((change, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Subspace:</span>
                    <span className="font-mono text-xs font-medium">
                      {change.subspace ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Key:</span>
                    <span className="font-mono text-xs font-medium">
                      {change.key ?? "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Value:</span>
                    <pre className="mt-1 max-w-full overflow-x-auto rounded bg-muted p-2 text-xs">
                      {change.value ?? "N/A"}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </ProposalContent.Row>
        )}
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
