import type { ProposalContentViewProps } from "./types";
import { SoftwareUpgradeContent } from "./variants/software-upgrade";
import { CommunityPoolSpendContent } from "./variants/community-pool-spend";
import { ParameterChangeContent } from "./variants/parameter-change";
import { TextContent } from "./variants/text";
import { AddValidatorContent } from "./variants/add-validator";
import { RemoveValidatorContent } from "./variants/remove-validator";
import { CancelUpgradeContent } from "./variants/cancel-upgrade";
import { UpdateParamsContent } from "./variants/update-params";
import { DefaultContent } from "./variants/default";
import { RawContentSection } from "./shared/raw-content-section";

interface ProposalContentRootProps extends ProposalContentViewProps {
  showRaw?: boolean;
}

export function ProposalContentRoot({ proposal, showRaw = true }: ProposalContentRootProps) {
  let content: React.ReactNode;
  switch (proposal.type) {
    // Upgrade
    case "SoftwareUpgrade":
    case "SoftwareUpgradeProposal":
      content = <SoftwareUpgradeContent proposal={proposal} />;
      break;
    case "CancelUpgrade":
    case "CancelSoftwareUpgrade":
    case "CancelSoftwareUpgradeProposal":
      content = <CancelUpgradeContent proposal={proposal} />;
      break;

    // Distribution
    case "CommunityPoolSpend":
    case "CommunityPoolSpendProposal":
      content = <CommunityPoolSpendContent proposal={proposal} />;
      break;

    // Params
    case "ParameterChange":
    case "ParameterChangeProposal":
      content = <ParameterChangeContent proposal={proposal} />;
      break;
    case "UpdateParams":
      content = <UpdateParamsContent proposal={proposal} />;
      break;

    // Text
    case "Text":
    case "TextProposal":
      content = <TextContent proposal={proposal} />;
      break;

    // Custom / chain-specific
    case "AddValidator":
      content = <AddValidatorContent proposal={proposal} />;
      break;
    case "RemoveValidator":
      content = <RemoveValidatorContent proposal={proposal} />;
      break;

    default:
      content = <DefaultContent proposal={proposal} />;
  }

  if (!showRaw) return <div className="h-full [&>*]:h-full">{content}</div>;

  return (
    <div className="space-y-6">
      {content}
      <RawContentSection content={proposal.content} />
    </div>
  );
}
