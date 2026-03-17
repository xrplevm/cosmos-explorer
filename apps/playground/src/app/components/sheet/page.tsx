"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@cosmos-explorer/ui/sheet";
import { Button } from "@cosmos-explorer/ui/button";
import { Input } from "@cosmos-explorer/ui/input";
import { Label } from "@cosmos-explorer/ui/label";
import { ComponentPreview } from "@/components/component-preview";

export default function SheetPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sheet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Extends Dialog to display content that complements the page.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sides</h2>
        <ComponentPreview>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Right</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Transaction Details</SheetTitle>
                  <SheetDescription>
                    View full transaction information.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Hash</Label>
                    <Input defaultValue="0xA1B2C3D4..." readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>Block</Label>
                    <Input defaultValue="482,910" readOnly />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Left</Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Browse the explorer.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
