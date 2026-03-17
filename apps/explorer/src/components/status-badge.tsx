import { Badge } from "@cosmos-explorer/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Success":
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
          {status}
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">
          {status}
        </Badge>
      );
    case "Failed":
      return <Badge variant="destructive">{status}</Badge>;
    case "Active":
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
          {status}
        </Badge>
      );
    case "Inactive":
      return (
        <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20">
          {status}
        </Badge>
      );
    case "Jailed":
      return <Badge variant="destructive">{status}</Badge>;
    case "Passed":
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
          {status}
        </Badge>
      );
    case "Rejected":
      return <Badge variant="destructive">{status}</Badge>;
    case "Voting":
      return (
        <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20">
          {status}
        </Badge>
      );
    case "Deposit":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">
          {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
