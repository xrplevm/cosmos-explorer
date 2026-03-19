"use client";

import { DataTableShowcase } from "@/components/data-table-showcase";
import { mockDelegations, formatTokenAmount } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Delegation = (typeof mockDelegations)[number];

const columns: Column<Delegation>[] = [
  {
    key: "validator",
    header: "Validator",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {row.validator.charAt(0)}
        </div>
        <span className="text-sm text-primary">{row.validator}</span>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    className: "text-right",
    render: (row) => (
      <span className="font-mono text-sm">
        {formatTokenAmount(row.amount, row.denom, 6)}
      </span>
    ),
  },
  {
    key: "rewards",
    header: "Pending Rewards",
    className: "text-right",
    render: (row) => (
      <span className="font-mono text-sm text-green-400">
        {formatTokenAmount(row.rewards, row.denom, 6)}
      </span>
    ),
  },
];

export default function AccountDelegationsPage() {
  return (
    <DataTableShowcase
      title="Account Delegations"
      description="Displays staking delegations with validator, amount, and pending rewards."
      tableTitle="Delegations"
      columns={columns}
      data={mockDelegations}
      rowKey={(row) => row.address}
    />
  );
}
