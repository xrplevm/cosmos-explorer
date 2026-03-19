import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  buildHref: (page: number, pageSize: number) => string;
}

function PaginationLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "pointer-events-none opacity-50",
        )}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      {children}
    </a>
  );
}

function PageSizeLinks({
  currentPageSize,
  buildHref,
}: {
  currentPageSize: number;
  buildHref: (page: number, pageSize: number) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Show rows:</span>
      <div className="flex items-center gap-0.5">
        {PAGE_SIZE_OPTIONS.map((size) => (
          <a
            key={size}
            href={buildHref(1, size)}
            className={cn(
              buttonVariants({ variant: size === currentPageSize ? "default" : "outline", size: "sm" }),
              "min-w-8",
              size === currentPageSize && "pointer-events-none",
            )}
          >
            {size}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Pagination({ currentPage, totalPages, pageSize, buildHref }: PaginationProps) {
  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <PageSizeLinks currentPageSize={pageSize} buildHref={buildHref} />

      <div className="flex items-center gap-1">
        <PaginationLink
          href={buildHref(1, pageSize)}
          disabled={currentPage <= 1}
        >
          First
        </PaginationLink>

        <PaginationLink
          href={buildHref(currentPage - 1, pageSize)}
          disabled={currentPage <= 1}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </PaginationLink>

        <span className="px-3 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages.toLocaleString()}
        </span>

        <PaginationLink
          href={buildHref(currentPage + 1, pageSize)}
          disabled={currentPage >= totalPages}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </PaginationLink>

        <PaginationLink
          href={buildHref(totalPages, pageSize)}
          disabled={currentPage >= totalPages}
        >
          Last
        </PaginationLink>
      </div>
    </nav>
  );
}
