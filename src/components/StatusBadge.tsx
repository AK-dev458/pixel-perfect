import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/mock-data";

const styles: Record<ProductStatus, string> = {
  Researching: "bg-info/12 text-info border-info/30",
  Approved: "bg-success/12 text-success border-success/30",
  Rejected: "bg-destructive/12 text-destructive border-destructive/30",
};

export function StatusBadge({ status, className }: { status: ProductStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}
