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
  /** URL-driven mode: prev/next are links and page size navigates. */
  basePath?: string;
  /** Controlled mode: called instead of navigating. Takes precedence over basePath. */
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Controlled mode: disables the controls while a fetch is in flight. */
  isPending?: boolean;
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

function PaginationButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function PageSizeSelect({
  currentPageSize,
  basePath,
  onPageSizeChange,
  disabled,
}: {
  currentPageSize: number;
  basePath?: string;
  onPageSizeChange?: (size: number) => void;
  disabled?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows:</span>
      <Select
        value={String(currentPageSize)}
        disabled={disabled}
        onValueChange={(value) => {
          const size = Number(value);
          if (onPageSizeChange) {
            onPageSizeChange(size);
          } else if (basePath) {
            router.push(withPageParams(basePath, 1, size));
          }
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

// basePath may already carry a query string (e.g. "/account/x?tab=messages").
function withPageParams(basePath: string, page: number, size: number): string {
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}&pageSize=${size}`;
}

const PrevIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const NextIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function Pagination({
  currentPage,
  pageSize,
  hasNextPage,
  basePath,
  onPageChange,
  onPageSizeChange,
  isPending,
}: PaginationProps) {
  const controlled = onPageChange != null;

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <PageSizeSelect
        currentPageSize={pageSize}
        basePath={basePath}
        onPageSizeChange={onPageSizeChange}
        disabled={isPending}
      />

      <div className="flex items-center gap-1">
        {controlled ? (
          <PaginationButton
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            disabled={currentPage <= 1 || isPending}
          >
            {PrevIcon}
            Previous
          </PaginationButton>
        ) : (
          <PaginationLink
            href={withPageParams(basePath ?? "", currentPage - 1, pageSize)}
            disabled={currentPage <= 1}
          >
            {PrevIcon}
            Previous
          </PaginationLink>
        )}

        <span className="px-3 text-sm text-muted-foreground">
          Page {currentPage}
        </span>

        {controlled ? (
          <PaginationButton
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            disabled={!hasNextPage || isPending}
          >
            Next
            {NextIcon}
          </PaginationButton>
        ) : (
          <PaginationLink
            href={withPageParams(basePath ?? "", currentPage + 1, pageSize)}
            disabled={!hasNextPage}
          >
            Next
            {NextIcon}
          </PaginationLink>
        )}
      </div>
    </nav>
  );
}
