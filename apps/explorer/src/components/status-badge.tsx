import { Badge } from "@cosmos-explorer/ui/badge";
import {
  IconCircleCheckFilled,
  IconLoader2,
  IconCircleXFilled,
  IconCircleFilled,
  IconGavel,
  IconCoinFilled,
} from "@tabler/icons-react";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Success":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCircleCheckFilled className="h-3.5 w-3.5 text-green-500" />
          {status}
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
          {status}
        </Badge>
      );
    case "Failed":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCircleXFilled className="h-3.5 w-3.5 text-destructive" />
          {status}
        </Badge>
      );
    case "Active":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCircleCheckFilled className="h-3.5 w-3.5 text-green-500" />
          {status}
        </Badge>
      );
    case "Inactive":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCircleFilled className="h-3.5 w-3.5" />
          {status}
        </Badge>
      );
    case "Jailed":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconGavel className="h-3.5 w-3.5 text-destructive" />
          {status}
        </Badge>
      );
    case "Passed":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCircleCheckFilled className="h-3.5 w-3.5 text-green-500" />
          {status}
        </Badge>
      );
    case "Rejected":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCircleXFilled className="h-3.5 w-3.5 text-destructive" />
          {status}
        </Badge>
      );
    case "Voting":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconLoader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
          {status}
        </Badge>
      );
    case "Deposit":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <IconCoinFilled className="h-3.5 w-3.5 text-yellow-500" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
