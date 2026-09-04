import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (pageNumber) =>
      pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1
  );

  const items = [];
  let lastPage = 0;
  for (const pageNumber of pages) {
    if (pageNumber - lastPage > 1) items.push(`ellipsis-${pageNumber}`);
    items.push(pageNumber);
    lastPage = pageNumber;
  }

  return (
    <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:justify-between sm:gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto px-1">
        {items.map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={cn(
                "h-9 w-9 rounded-lg text-sm font-medium transition-colors",
                item === page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="px-1 text-muted-foreground text-sm">
              ...
            </span>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
