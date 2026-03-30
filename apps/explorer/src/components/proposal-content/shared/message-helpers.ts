export interface ContentMessage {
  "@type"?: string;
  moniker?: string;
  description?: { moniker?: string };
  validator_address?: string;
  validatorAddress?: string;
  authority?: string;
  sender?: string;
  plan?: { name?: string; height?: string };
  amount?: { denom?: string; amount?: string }[] | { denom?: string; amount?: string };
  recipient?: string;
  [key: string]: unknown;
}

export function shortType(fullType: string): string {
  return fullType.split(".").pop()?.split("/").pop() ?? fullType;
}

export const TYPE_COLORS: Record<string, string> = {
  MsgRemoveValidator: "bg-red-500/20 text-red-400 border-red-500/30",
  RemoveValidator: "bg-red-500/20 text-red-400 border-red-500/30",
  MsgAddValidator: "bg-green-500/20 text-green-400 border-green-500/30",
  AddValidator: "bg-green-500/20 text-green-400 border-green-500/30",
  MsgSoftwareUpgrade: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SoftwareUpgrade: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SoftwareUpgradeProposal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MsgCancelUpgrade: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CancelUpgrade: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CancelSoftwareUpgrade: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MsgCommunityPoolSpend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CommunityPoolSpend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MsgUpdateParams: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  UpdateParams: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  ParameterChange: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  ParameterChangeProposal: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  TextProposal: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  Text: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName] ?? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

export function getMoniker(msg: ContentMessage): string | null {
  return msg.moniker ?? msg.description?.moniker ?? null;
}

export function getValidatorAddress(msg: ContentMessage): string | null {
  return msg.validator_address ?? msg.validatorAddress ?? null;
}
