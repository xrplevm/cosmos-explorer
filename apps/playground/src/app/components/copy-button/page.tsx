import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { ComponentPreview } from "@/components/component-preview";

const SAMPLE_HASH =
  "160EA0683447DACEA259F6DA2BB87AD329FB6A44EFA5625D378DC71A226097A8";

export default function CopyButtonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Copy Button</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Icon button that copies a string to the clipboard with tooltip feedback.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>

        <ComponentPreview title="Standalone">
          <CopyButton value={SAMPLE_HASH} label="transaction hash" />
        </ComponentPreview>

        <ComponentPreview title="Next to monospace text (typical for hashes)">
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <span className="min-w-0 flex-1 font-mono text-xs break-all">
              {SAMPLE_HASH}
            </span>
            <CopyButton value={SAMPLE_HASH} label="transaction hash" />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Variants</h2>

        <ComponentPreview title="Ghost (default)">
          <CopyButton value="sample" label="sample" />
        </ComponentPreview>

        <ComponentPreview title="Outline">
          <CopyButton value="sample" label="sample" variant="outline" />
        </ComponentPreview>
      </section>
    </div>
  );
}
