import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import { ComponentPreview } from "@/components/component-preview";

export default function SkeletonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skeleton</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Used to show a placeholder while content is loading.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Card skeleton</h2>
        <ComponentPreview>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Table row skeleton</h2>
        <ComponentPreview>
          <div className="w-full space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
