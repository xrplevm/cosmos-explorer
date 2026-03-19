import { Badge } from "@cosmos-explorer/ui/badge";
import { ComponentPreview } from "@/components/component-preview";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Success":
    case "Active":
    case "Passed":
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
          {status}
        </Badge>
      );
    case "Pending":
    case "Deposit":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">
          {status}
        </Badge>
      );
    case "Failed":
    case "Jailed":
    case "Rejected":
      return <Badge variant="destructive">{status}</Badge>;
    case "Voting":
      return (
        <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20">
          {status}
        </Badge>
      );
    case "Inactive":
      return (
        <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20">
          {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function StatusBadgePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Status Badge</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Color-coded badge for transaction and validator statuses.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Transaction statuses</h2>
        <ComponentPreview title="Success / Failed / Pending">
          <StatusBadge status="Success" />
          <StatusBadge status="Failed" />
          <StatusBadge status="Pending" />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Validator statuses</h2>
        <ComponentPreview title="Active / Inactive / Jailed">
          <StatusBadge status="Active" />
          <StatusBadge status="Inactive" />
          <StatusBadge status="Jailed" />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Proposal statuses</h2>
        <ComponentPreview title="Passed / Rejected / Voting / Deposit">
          <StatusBadge status="Passed" />
          <StatusBadge status="Rejected" />
          <StatusBadge status="Voting" />
          <StatusBadge status="Deposit" />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Fallback</h2>
        <ComponentPreview title="Unknown status">
          <StatusBadge status="Custom" />
        </ComponentPreview>
      </section>
    </div>
  );
}
