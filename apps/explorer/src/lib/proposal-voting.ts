import type { ProposalTally, GovParams } from "@cosmos-explorer/core";

export function getTallyTotal(tally: ProposalTally | null): number {
  if (!tally) return 0;
  return ["yes", "no", "abstain", "noWithVeto"].reduce((sum, key) => {
    const value = Number(tally[key as keyof ProposalTally] ?? 0);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);
}

export function toVotePercent(value: string, total: number): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || total <= 0) return null;
  return (parsed / total) * 100;
}

export interface VotingMetrics {
  yes: number | null;
  no: number | null;
  abstain: number | null;
  veto: number | null;
  tallyTotal: number;
  quorumThreshold: number;
  yesThreshold: number;
  vetoThreshold: number;
  activeYesThreshold: number;
  isExpedited: boolean;
  turnoutPct: number | null;
  quorumReached: boolean;
  yesThresholdPct: number | null;
  yesPasses: boolean;
  isVetoed: boolean;
  approved: boolean;
}

export function computeVotingMetrics(
  tally: ProposalTally | null,
  govParams: GovParams | null,
  votingStartTime: string | null,
  votingEndTime: string | null,
): VotingMetrics {
  const tallyTotal = getTallyTotal(tally);

  const yes = tally ? toVotePercent(tally.yes, tallyTotal) : null;
  const no = tally ? toVotePercent(tally.no, tallyTotal) : null;
  const abstain = tally ? toVotePercent(tally.abstain, tallyTotal) : null;
  const veto = tally ? toVotePercent(tally.noWithVeto, tallyTotal) : null;

  const quorumThreshold = govParams?.quorum ?? 66.7;
  const yesThreshold = govParams?.threshold ?? 66.7;
  const vetoThreshold = govParams?.vetoThreshold ?? 33.4;
  const expeditedYesThreshold = govParams?.expeditedThreshold ?? 80;
  const expeditedMaxSeconds = govParams?.expeditedVotingPeriodSeconds ?? 86400;

  const isExpedited = (() => {
    if (!votingStartTime || !votingEndTime) return false;
    const durationSeconds =
      (new Date(votingEndTime).getTime() - new Date(votingStartTime).getTime()) / 1000;
    return durationSeconds <= expeditedMaxSeconds * 2;
  })();
  const activeYesThreshold = isExpedited ? expeditedYesThreshold : yesThreshold;

  const bondedAmount = tally?.bondedTokens ? Number(tally.bondedTokens.amount) : 0;
  const turnoutPct = bondedAmount > 0 ? Math.min((tallyTotal / bondedAmount) * 100, 100) : null;
  const quorumReached = turnoutPct != null && turnoutPct >= quorumThreshold;

  const yesRaw = Number(tally?.yes ?? 0);
  const noRaw = Number(tally?.no ?? 0);
  const vetoRaw = Number(tally?.noWithVeto ?? 0);
  const nonAbstainTotal = yesRaw + noRaw + vetoRaw;
  const yesThresholdPct = nonAbstainTotal > 0 ? (yesRaw / nonAbstainTotal) * 100 : null;
  const yesPasses = yesThresholdPct != null && yesThresholdPct >= activeYesThreshold;
  const vetoPct = tallyTotal > 0 ? (vetoRaw / tallyTotal) * 100 : null;
  const isVetoed = vetoPct != null && vetoPct >= vetoThreshold;
  const approved = quorumReached && yesPasses && !isVetoed;

  return {
    yes,
    no,
    abstain,
    veto,
    tallyTotal,
    quorumThreshold,
    yesThreshold,
    vetoThreshold,
    activeYesThreshold,
    isExpedited,
    turnoutPct,
    quorumReached,
    yesThresholdPct,
    yesPasses,
    isVetoed,
    approved,
  };
}
