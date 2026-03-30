import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { getServices } from "@/lib/services";
import { ProposalVotesContent } from "@/components/proposal-votes-content";

interface ProposalVotesCardProps {
  proposalId: number;
}

export interface SerializableValidator {
  moniker: string;
  address: string;
  avatarUrl: string | null;
}

export async function ProposalVotesCard({ proposalId }: ProposalVotesCardProps) {
  const { proposalService, validatorService } = getServices();

  const [{ votes, total }, validatorSet] = await Promise.all([
    proposalService.getProposalVotes(proposalId, { limit: 1000, offset: 0 }),
    validatorService.getValidatorSet(),
  ]);

  const validatorMap: Record<string, SerializableValidator> = {};
  for (const v of validatorSet.items) {
    if (v.selfDelegateAddress) {
      validatorMap[v.selfDelegateAddress] = {
        moniker: v.moniker,
        address: v.address,
        avatarUrl: v.avatarUrl,
      };
    }
  }

  const voterAddresses = new Set(votes.map((v) => v.voterAddress));
  const didNotVote: SerializableValidator[] = validatorSet.items
    .filter((v) => v.selfDelegateAddress && !voterAddresses.has(v.selfDelegateAddress))
    .map((v) => ({
      moniker: v.moniker,
      address: v.address,
      avatarUrl: v.avatarUrl,
    }));

  return (
    <ProposalVotesContent
      votes={votes}
      total={total}
      validatorMap={validatorMap}
      didNotVote={didNotVote}
    />
  );
}

export function ProposalVotesCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Votes
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            <span className="inline-block h-3.5 w-16 animate-pulse rounded bg-muted align-middle" />
          </span>
        </CardTitle>
        {/* Filter buttons skeleton */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-7 animate-pulse rounded-md bg-muted"
              style={{ width: `${[40, 52, 44, 60, 80, 80][i]}px` }}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* Table header */}
        <div className="flex items-center border-b border-border pb-2 mb-2">
          {["w-36", "w-28", "w-20", "w-20", "w-28"].map((w, i) => (
            <div key={i} className={`${w} ${i === 4 ? "ml-auto" : ""}`}>
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        {/* Table rows */}
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-36 flex items-center gap-2">
                <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
                <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
              </div>
              <div className="w-28">
                <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="w-20">
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="w-20">
                <div className="h-3.5 w-14 animate-pulse rounded bg-muted" />
              </div>
              <div className="ml-auto w-28 flex justify-end">
                <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
