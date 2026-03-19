import { Pagination } from "@cosmos-explorer/ui/pagination";
import { ComponentPreview } from "@/components/component-preview";

export default function PaginationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagination</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Table pagination with page size selector and prev/next navigation.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">First page (has next)</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={1} pageSize={25} hasNextPage buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Middle page</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={500} pageSize={25} hasNextPage buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Last page (no next)</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={10} pageSize={25} hasNextPage={false} buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Different page size</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={1} pageSize={100} hasNextPage buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
