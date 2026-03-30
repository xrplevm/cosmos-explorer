import {
  PROPOSAL_ICON_CONFIGS,
  DEFAULT_PROPOSAL_ICON_CONFIG,
  type ProposalIconConfig,
} from "./proposal-icon.constants";

interface ProposalIconProps {
  type: string;
  className?: string;
  configs?: Record<string, ProposalIconConfig>;
}

export function ProposalIcon({
  type,
  className,
  configs = PROPOSAL_ICON_CONFIGS,
}: ProposalIconProps) {
  const cfg = configs[type] ?? DEFAULT_PROPOSAL_ICON_CONFIG;
  const Icon = cfg.icon;

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.color} ${className ?? ""}`}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
