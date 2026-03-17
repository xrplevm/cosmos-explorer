"use client";

import { ScrollArea } from "@cosmos-explorer/ui/scroll-area";
import { Separator } from "@cosmos-explorer/ui/separator";
import { ComponentPreview } from "@/components/component-preview";

const blocks = Array.from({ length: 25 }, (_, i) => ({
  height: 482910 - i,
  txs: Math.floor(Math.random() * 20) + 1,
}));

export default function ScrollAreaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scroll Area</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Augments native scroll functionality with custom styling.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <ScrollArea className="h-72 w-48 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Recent Blocks</h4>
              {blocks.map((block) => (
                <div key={block.height}>
                  <div className="flex items-center justify-between py-2 text-sm">
                    <span className="font-mono">#{block.height}</span>
                    <span className="text-muted-foreground">{block.txs} txs</span>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        </ComponentPreview>
      </section>
    </div>
  );
}
