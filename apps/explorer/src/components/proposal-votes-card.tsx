import {
  DataTableSkeleton,
  type SkeletonColumn,
} from "@cosmos-explorer/ui/data-table";
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

  return (
    <ProposalVotesContent
      votes={votes}
      total={total}
      validatorMap={validatorMap}
    />
  );
}

const votesSkeletonColumns: SkeletonColumn[] = [
  { key: "validator", header: "Validator", width: "w-36" },
  { key: "address", header: "Address", width: "w-28" },
  { key: "vote", header: "Vote", width: "w-20" },
  { key: "block", header: "Block", width: "w-20" },
  { key: "time", header: "Time", className: "text-right", width: "w-28" },
];

export function ProposalVotesCardSkeleton() {
  return (
    <DataTableSkeleton
      title="Votes"
      columns={votesSkeletonColumns}
      rows={10}
    />
  );
}
