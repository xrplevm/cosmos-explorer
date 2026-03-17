"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cosmos-explorer/ui/dialog";
import { Button } from "@cosmos-explorer/ui/button";
import { Input } from "@cosmos-explorer/ui/input";
import { Label } from "@cosmos-explorer/ui/label";
import { ComponentPreview } from "@/components/component-preview";

export default function DialogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dialog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A modal dialog that interrupts the user.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>
                  View and manage transaction information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="hash">Tx Hash</Label>
                  <Input id="hash" defaultValue="0xA1B2C3D4E5F6..." readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memo">Memo</Label>
                  <Input id="memo" placeholder="Add a memo..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ComponentPreview>
      </section>
    </div>
  );
}
