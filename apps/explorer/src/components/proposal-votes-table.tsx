import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Badge } from "@cosmos-explorer/ui/badge";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Avatar, AvatarFallback, AvatarImage } from "@cosmos-explorer/ui/avatar";
import { Timestamp } from "@/components/timestamp";
import { formatHash } from "@/lib/formatters";
import type { ProposalVote, VoteOption } from "@cosmos-explorer/core";
import type { SerializableValidator } from "@/components/proposal-votes-card";
import {
  IconThumbUp,
  IconThumbDown,
  IconMinus,
  IconHandStop,
} from "@tabler/icons-react";

function getVoteBadge(option: VoteOption) {
  switch (option) {
    case "yes":
      return (
        <Badge className="gap-1 border-transparent bg-green-500/20 text-green-400">
          <IconThumbUp className="h-3 w-3" />
          Yes
        </Badge>
      );
    case "no":
      return (
        <Badge className="gap-1 border-transparent bg-red-500/20 text-red-400">
          <IconThumbDown className="h-3 w-3" />
          No
        </Badge>
      );
    case "abstain":
      return (
        <Badge className="gap-1 border-transparent bg-zinc-500/20 text-zinc-400">
          <IconMinus className="h-3 w-3" />
          Abstain
        </Badge>
      );
    case "noWithVeto":
      return (
        <Badge className="gap-1 border-transparent bg-yellow-500/20 text-yellow-400">
          <IconHandStop className="h-3 w-3" />
          No with Veto
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          Unknown
        </Badge>
      );
  }
}

export function ProposalVotesTable({
  votes,
  validatorMap,
}: {
  votes: ProposalVote[];
  validatorMap: Record<string, SerializableValidator>;
}) {
  if (votes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No votes found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Validator</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Vote</TableHead>
            <TableHead>Block</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {votes.map((vote) => {
            const validator = validatorMap[vote.voterAddress];
            return (
              <TableRow key={`${vote.voterAddress}-${String(vote.height)}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {validator ? (
                      <Link href={`/validators/${encodeURIComponent(validator.address)}`}>
                        <Avatar className="h-8 w-8 shrink-0">
                          {validator.avatarUrl && (
                            <AvatarImage src={validator.avatarUrl} alt={validator.moniker} />
                          )}
                          <AvatarFallback className="text-xs">
                            {validator.moniker.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    ) : (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          {vote.voterAddress.slice(4, 6).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {validator ? (
                      <Link
                        href={`/validators/${encodeURIComponent(validator.address)}`}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        {validator.moniker}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/account/${encodeURIComponent(vote.voterAddress)}`}
                      className="font-mono text-xs text-muted-foreground hover:underline"
                    >
                      {formatHash(vote.voterAddress)}
                    </Link>
                    <CopyButton
                      value={vote.voterAddress}
                      label="voter address"
                      size="xs"
                    />
                  </div>
                </TableCell>
                <TableCell>{getVoteBadge(vote.option)}</TableCell>
                <TableCell className="font-mono text-sm">
                  <Link
                    href={`/blocks/${String(vote.height)}`}
                    className="text-foreground hover:underline"
                  >
                    #{vote.height.toLocaleString()}
                  </Link>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  <Timestamp value={vote.timestamp} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
