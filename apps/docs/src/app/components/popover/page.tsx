"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cosmos-explorer/ui/popover";
import { Button } from "@cosmos-explorer/ui/button";
import { Input } from "@cosmos-explorer/ui/input";
import { Label } from "@cosmos-explorer/ui/label";
import { ComponentPreview } from "@/components/component-preview";

export default function PopoverPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Popover</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Displays rich content in a portal, triggered by a button.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Filter</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Set filters for the transaction list.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="min-amount">Min amount</Label>
                    <Input id="min-amount" placeholder="0.00" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="max-amount">Max amount</Label>
                    <Input id="max-amount" placeholder="1,000.00" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentPreview>
      </section>
    </div>
  );
}
