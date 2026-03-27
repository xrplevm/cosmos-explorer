export interface GovParams {
  quorum: number;
  threshold: number;
  vetoThreshold: number;
  expeditedThreshold: number;
  expeditedVotingPeriodSeconds: number;
}

const FALLBACK_PARAMS: GovParams = {
  quorum: 66.7,
  threshold: 66.7,
  vetoThreshold: 33.4,
  expeditedThreshold: 80,
  expeditedVotingPeriodSeconds: 86400,
};

export async function getGovParams(cosmosApiUrl: string): Promise<GovParams> {
  try {
    const res = await fetch(`${cosmosApiUrl}/cosmos/gov/v1/params/tallying`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) return FALLBACK_PARAMS;

    const data = await res.json();
    const params = data?.params;
    if (!params) return FALLBACK_PARAMS;

    const expeditedSeconds = params.expedited_voting_period
      ? parseFloat(params.expedited_voting_period.replace("s", ""))
      : FALLBACK_PARAMS.expeditedVotingPeriodSeconds;

    return {
      quorum: parseFloat(params.quorum) * 100,
      threshold: parseFloat(params.threshold) * 100,
      vetoThreshold: parseFloat(params.veto_threshold) * 100,
      expeditedThreshold: parseFloat(params.expedited_threshold) * 100,
      expeditedVotingPeriodSeconds: expeditedSeconds,
    };
  } catch {
    return FALLBACK_PARAMS;
  }
}
