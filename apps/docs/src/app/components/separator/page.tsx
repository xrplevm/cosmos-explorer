import { Separator } from "@cosmos-explorer/ui/separator";
import { ComponentPreview } from "@/components/component-preview";

export default function SeparatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Separator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visually or semantically separates content.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Horizontal</h2>
        <ComponentPreview>
          <div className="w-full max-w-sm">
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">Block #482,910</h4>
              <p className="text-sm text-muted-foreground">12 transactions</p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">Block #482,909</h4>
              <p className="text-sm text-muted-foreground">8 transactions</p>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Vertical</h2>
        <ComponentPreview>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <span>Blocks</span>
            <Separator orientation="vertical" />
            <span>Transactions</span>
            <Separator orientation="vertical" />
            <span>Validators</span>
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
