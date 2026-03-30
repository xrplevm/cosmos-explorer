import type { ComponentType } from "react";
import {
  IconRocket,
  IconBan,
  IconCoins,
  IconAdjustments,
  IconFileText,
  IconUserPlus,
  IconUserMinus,
  IconFile,
} from "@tabler/icons-react";

export interface ProposalIconConfig {
  icon: ComponentType<{ className?: string }>;
  bg: string;
  color: string;
}

export const PROPOSAL_ICON_CONFIGS: Record<string, ProposalIconConfig> = {
  SoftwareUpgrade:              { icon: IconRocket,      bg: "bg-blue-500/15",   color: "text-blue-400" },
  SoftwareUpgradeProposal:      { icon: IconRocket,      bg: "bg-blue-500/15",   color: "text-blue-400" },
  CancelUpgrade:                { icon: IconBan,         bg: "bg-red-500/15",    color: "text-red-400" },
  CancelSoftwareUpgrade:        { icon: IconBan,         bg: "bg-red-500/15",    color: "text-red-400" },
  CancelSoftwareUpgradeProposal: { icon: IconBan,        bg: "bg-red-500/15",    color: "text-red-400" },
  CommunityPoolSpend:           { icon: IconCoins,       bg: "bg-amber-500/15",  color: "text-amber-400" },
  CommunityPoolSpendProposal:   { icon: IconCoins,       bg: "bg-amber-500/15",  color: "text-amber-400" },
  ParameterChange:              { icon: IconAdjustments,  bg: "bg-violet-500/15", color: "text-violet-400" },
  ParameterChangeProposal:      { icon: IconAdjustments,  bg: "bg-violet-500/15", color: "text-violet-400" },
  UpdateParams:                 { icon: IconAdjustments,  bg: "bg-violet-500/15", color: "text-violet-400" },
  Text:                         { icon: IconFileText,    bg: "bg-zinc-500/15",   color: "text-zinc-400" },
  TextProposal:                 { icon: IconFileText,    bg: "bg-zinc-500/15",   color: "text-zinc-400" },
  AddValidator:                 { icon: IconUserPlus,    bg: "bg-green-500/15",  color: "text-green-400" },
  RemoveValidator:              { icon: IconUserMinus,   bg: "bg-orange-500/15", color: "text-orange-400" },
};

export const DEFAULT_PROPOSAL_ICON_CONFIG: ProposalIconConfig = {
  icon: IconFile,
  bg: "bg-zinc-500/15",
  color: "text-zinc-400",
};
