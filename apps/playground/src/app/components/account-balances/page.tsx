"use client";

import { DataTableShowcase } from "@/components/data-table-showcase";
import { mockBalances, formatTokenAmount } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Balance = (typeof mockBalances)[number];

const columns: Column<Balance>[] = [
  {
    key: "denom",
    header: "Token",
    render: (row) => <span className="text-sm font-medium">{row.denom}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    className: "text-right",
    render: (row) => (
      <span className="font-mono text-sm">
        {formatTokenAmount(row.amount, row.denom)}
      </span>
    ),
  },
];

export default function AccountBalancesPage() {
  return (
    <DataTableShowcase
      title="Account Balances"
      description="Displays token balances for an account."
      tableTitle="Balances"
      columns={columns}
      data={mockBalances}
      rowKey={(row) => row.denom}
    />
  );
}
