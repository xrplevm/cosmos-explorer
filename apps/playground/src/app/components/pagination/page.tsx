import { Pagination } from "@cosmos-explorer/ui/pagination";
import { ComponentPreview } from "@/components/component-preview";

export default function PaginationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagination</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Table pagination with page size selector, first/last, and prev/next navigation.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">First page</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={1} totalPages={39508} pageSize={25} buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Middle page</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={500} totalPages={39508} pageSize={25} buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Last page</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={39508} totalPages={39508} pageSize={25} buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Different page size</h2>
        <ComponentPreview>
          <div className="w-full">
            <Pagination currentPage={1} totalPages={9877} pageSize={100} buildHref={(p, s) => `#page-${String(p)}-${String(s)}`} />
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
