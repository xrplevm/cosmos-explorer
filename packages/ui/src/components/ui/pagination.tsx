"use client";

import { useRouter } from "next/navigation";
import { PAGE_SIZE_OPTIONS } from "./pagination-constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  basePath: string;
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

function PageSizeSelect({
  currentPageSize,
  basePath,
}: {
  currentPageSize: number;
  basePath: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows:</span>
      <Select
        value={String(currentPageSize)}
        onValueChange={(value) => {
          router.push(`${basePath}?page=1&pageSize=${value}`);
        }}
      >
        <SelectTrigger className="h-8 w-[70px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={String(size)} className="text-xs">
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function Pagination({ currentPage, pageSize, hasNextPage, basePath }: PaginationProps) {
  const href = (page: number, size: number) => `${basePath}?page=${page}&pageSize=${size}`;

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <PageSizeSelect currentPageSize={pageSize} basePath={basePath} />

      <div className="flex items-center gap-1">
        <PaginationLink
          href={href(currentPage - 1, pageSize)}
          disabled={currentPage <= 1}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </PaginationLink>

        <span className="px-3 text-sm text-muted-foreground">
          Page {currentPage}
        </span>

        <PaginationLink
          href={href(currentPage + 1, pageSize)}
          disabled={!hasNextPage}
        >
          Next
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </PaginationLink>
      </div>
    </nav>
  );
}
