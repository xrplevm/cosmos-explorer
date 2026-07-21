import { Badge } from "@cosmos-explorer/ui/badge";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import Link from "next/link";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { StatusBadge } from "@/components/status-badge";
import { formatHash } from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
import type { AccountMessage } from "@cosmos-explorer/core";

export function AccountMessagesCard({
  messages,
  error,
}: {
  messages: AccountMessage[];
  error: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="py-8 text-center text-sm text-destructive">
            Failed to load messages. Please try again later.
          </p>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Block</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message, index) => (
                  <TableRow key={`${message.transactionHash}-${index}`}>
                    <TableCell>
                      <Badge variant="outline">
                        {message.type === "EthereumTx" && (
                          <IconCurrencyEthereum className="h-3.5 w-3.5" />
                        )}
                        {message.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/transactions/${message.transactionHash}`}
                          className="font-mono text-sm text-primary-soft hover:text-primary transition-colors"
                        >
                          {formatHash(message.transactionHash)}
                        </Link>
                        <CopyButton
                          value={message.transactionHash}
                          label="tx hash"
                          size="xs"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={message.success ? "Success" : "Failed"}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <Link
                        href={`/blocks/${String(message.height)}`}
                        className="text-primary-soft hover:text-primary transition-colors"
                      >
                        #{message.height.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      <Timestamp value={message.timestamp} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
