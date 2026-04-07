"use client";

import { ProgressBar } from "@cosmos-explorer/ui/progress-bar";
import { ComponentPreview } from "@/components/component-preview";

export default function ProgressBarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Progress Bar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Progress bar with threshold marker line.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Quorum not reached</h2>
        <ComponentPreview>
          <div className="w-full">
            <ProgressBar
              value={55.56}
              threshold={66.7}
              colorClass="bg-amber-500"
              label="Quorum"
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Quorum reached</h2>
        <ComponentPreview>
          <div className="w-full">
            <ProgressBar
              value={82.3}
              threshold={66.7}
              label="Quorum"
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Low value</h2>
        <ComponentPreview>
          <div className="w-full">
            <ProgressBar
              value={12.5}
              threshold={50}
              colorClass="bg-amber-500"
              label="Turnout"
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Small size</h2>
        <ComponentPreview>
          <div className="w-full">
            <ProgressBar
              value={45}
              threshold={66.7}
              colorClass="bg-amber-500"
              label="Quorum"
              size="sm"
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">No label</h2>
        <ComponentPreview>
          <div className="w-full">
            <ProgressBar
              value={73}
              threshold={50}
              label=""
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Null value</h2>
        <ComponentPreview>
          <div className="w-full">
            <ProgressBar
              value={null}
              threshold={66.7}
              label="Quorum"
            />
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
