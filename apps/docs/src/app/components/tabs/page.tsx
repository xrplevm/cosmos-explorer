"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@cosmos-explorer/ui/tabs";
import { ComponentPreview } from "@/components/component-preview";

export default function TabsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tabs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A set of layered sections of content.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <Tabs defaultValue="transactions" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="validators">Validators</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="mt-4">
              <p className="text-sm text-muted-foreground">Recent transactions will appear here.</p>
            </TabsContent>
            <TabsContent value="blocks" className="mt-4">
              <p className="text-sm text-muted-foreground">Latest blocks will appear here.</p>
            </TabsContent>
            <TabsContent value="validators" className="mt-4">
              <p className="text-sm text-muted-foreground">Active validators will appear here.</p>
            </TabsContent>
          </Tabs>
        </ComponentPreview>
      </section>
    </div>
  );
}
