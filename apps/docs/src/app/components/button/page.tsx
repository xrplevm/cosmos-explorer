import { Button } from "@cosmos-explorer/ui/button";
import { ComponentPreview } from "@/components/component-preview";

export default function ButtonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Button</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Displays a button or a component that looks like a button.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Variants</h2>

        <ComponentPreview title="Default">
          <Button>Default</Button>
        </ComponentPreview>

        <ComponentPreview title="Secondary">
          <Button variant="secondary">Secondary</Button>
        </ComponentPreview>

        <ComponentPreview title="Destructive">
          <Button variant="destructive">Destructive</Button>
        </ComponentPreview>

        <ComponentPreview title="Outline">
          <Button variant="outline">Outline</Button>
        </ComponentPreview>

        <ComponentPreview title="Ghost">
          <Button variant="ghost">Ghost</Button>
        </ComponentPreview>

        <ComponentPreview title="Link">
          <Button variant="link">Link</Button>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sizes</h2>

        <ComponentPreview title="All sizes">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">States</h2>

        <ComponentPreview title="Disabled">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </ComponentPreview>
      </section>
    </div>
  );
}
