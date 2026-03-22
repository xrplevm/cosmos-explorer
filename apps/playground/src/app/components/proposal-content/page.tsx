"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cosmos-explorer/ui/tabs";
import type { ProposalDetail } from "@cosmos-explorer/core";
import { ProposalContentRoot } from "@/components/proposal-content-showcase";
import { mockProposalDetails } from "@/lib/mock-data";

const variants = [
  { key: "softwareUpgrade", label: "Software Upgrade" },
  { key: "communityPoolSpend", label: "Community Pool Spend" },
  { key: "parameterChange", label: "Parameter Change" },
  { key: "text", label: "Text" },
  { key: "addValidator", label: "Add Validator" },
  { key: "removeValidator", label: "Remove Validator" },
  { key: "cancelUpgrade", label: "Cancel Upgrade" },
  { key: "updateParams", label: "Update Params" },
] as const;

export default function ProposalContentPage() {
  const [activeTab, setActiveTab] = useState<string>("softwareUpgrade");
  const proposal = mockProposalDetails[activeTab as keyof typeof mockProposalDetails] as ProposalDetail;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proposal Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Type-specific proposal content variants with composable building blocks.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {variants.map((v) => (
            <TabsTrigger key={v.key} value={v.key} className="text-xs">
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {variants.map((v) => (
          <TabsContent key={v.key} value={v.key} className="mt-6">
            <ProposalContentRoot proposal={proposal} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
