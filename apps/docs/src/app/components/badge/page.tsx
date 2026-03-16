import { Badge } from "@cosmos-explorer/ui/badge";
import { ComponentPreview } from "@/components/component-preview";

export default function BadgePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Badge</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Displays a badge or a component that looks like a badge.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Variants</h2>

        <ComponentPreview title="Default">
          <Badge>Default</Badge>
        </ComponentPreview>

        <ComponentPreview title="Secondary">
          <Badge variant="secondary">Secondary</Badge>
        </ComponentPreview>

        <ComponentPreview title="Destructive">
          <Badge variant="destructive">Destructive</Badge>
        </ComponentPreview>

        <ComponentPreview title="Outline">
          <Badge variant="outline">Outline</Badge>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Usage examples</h2>
        <ComponentPreview title="Status indicators">
          <Badge className="bg-green-500/15 text-green-400 border-green-500/20">Success</Badge>
          <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
        </ComponentPreview>
      </section>
    </div>
  );
}
