import { Input } from "@cosmos-explorer/ui/input";
import { Label } from "@cosmos-explorer/ui/label";
import { ComponentPreview } from "@/components/component-preview";

export default function InputPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Input</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Displays a form input field.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <Input placeholder="Search transactions..." className="max-w-sm" />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">With label</h2>
        <ComponentPreview>
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="address">Wallet address</Label>
            <Input id="address" placeholder="cosmos1..." />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Disabled</h2>
        <ComponentPreview>
          <Input disabled placeholder="Disabled input" className="max-w-sm" />
        </ComponentPreview>
      </section>
    </div>
  );
}
