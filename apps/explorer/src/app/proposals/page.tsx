import { Pagination } from "@cosmos-explorer/ui/pagination";
import { PAGE_SIZE_OPTIONS } from "@cosmos-explorer/ui/pagination-constants";
import { ProposalList } from "@/components/proposal-list";
import { getServices } from "@/lib/services";

const DEFAULT_PAGE_SIZE = 25;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const currentPage = parsePositiveInt(params.page, 1);
  const rawSize = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const offset = (currentPage - 1) * pageSize;

  const { proposalService } = getServices();
  const proposals = await proposalService.getProposals({ limit: pageSize + 1, offset });
  const hasNextPage = proposals.length > pageSize;
  const visibleProposals = hasNextPage ? proposals.slice(0, pageSize) : proposals;

  return (
    <div className="space-y-6">
      <ProposalList proposals={visibleProposals} />

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        basePath="/proposals"
      />
    </div>
  );
}
