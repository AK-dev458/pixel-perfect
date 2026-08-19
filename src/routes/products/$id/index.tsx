import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, PackageX, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES, type ProductStatus } from "@/lib/mock-data";
import { formatCurrency, formatPercent, productMargin, productProfit } from "@/lib/profit";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$id/")({
  head: () => ({
    meta: [
      { title: "Product Details | ProfitScout" },
      {
        name: "description",
        content:
          "Review wholesale product details, supplier contact information, profitability breakdown and research status.",
      },
      { property: "og:title", content: "Product Details | ProfitScout" },
      {
        property: "og:description",
        content: "Full profitability and supplier breakdown for a wholesale product.",
      },
    ],
  }),
  component: ProductDetailsPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

function ProductDetailsPage() {
  const { id } = Route.useParams();
  const { getProduct, getSupplier, setProductStatus, deleteProduct } = useStore();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const product = getProduct(id);

  if (!product) {
    return (
      <AppLayout title="Product not found">
        <div className="surface-card">
          <EmptyState
            icon={PackageX}
            title="Something went wrong. Please try again."
            description="This product is no longer in your prototype workspace."
            action={
              <Button asChild>
                <Link to="/products">Try Again</Link>
              </Button>
            }
          />
        </div>
      </AppLayout>
    );
  }

  const supplier = getSupplier(product.supplierId);
  const profit = productProfit(product);
  const margin = productMargin(product);

  return (
    <AppLayout
      title={product.name}
      description={`${product.sku} · ${product.asin}`}
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/products">
              <ArrowLeft className="size-4" /> Back
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products/$id/edit" params={{ id: product.id }}>
              <Pencil className="size-4" /> Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setConfirming(true)}>
            <Trash2 className="size-4" /> Delete
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <section className="surface-card p-5">
            <h2 className="text-base font-semibold">Product information</h2>
            <dl className="mt-3">
              <Row label="Name" value={product.name} />
              <Row label="SKU" value={product.sku} />
              <Row label="ASIN" value={product.asin} />
              <Row label="Category" value={product.category} />
              <Row label="Quantity" value={String(product.quantity)} />
              <Row label="Notes" value={product.notes || "—"} />
            </dl>
          </section>

          <section className="surface-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Supplier</h2>
              {supplier ? (
                <Button asChild variant="outline" size="sm">
                  <Link to="/suppliers/$id" params={{ id: supplier.id }}>
                    View supplier
                  </Link>
                </Button>
              ) : null}
            </div>
            {supplier ? (
              <dl className="mt-3">
                <Row label="Supplier name" value={supplier.name} />
                <Row label="Contact" value={supplier.contactName} />
                <Row label="Email" value={supplier.email} />
                <Row label="Phone" value={supplier.phone} />
                <Row label="Website" value={supplier.website} />
                <Row label="Notes" value={supplier.notes || "—"} />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No supplier assigned.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="surface-card p-5">
            <h2 className="text-base font-semibold">Profitability</h2>
            <dl className="mt-3">
              <Row label="Buy cost" value={formatCurrency(product.buyCost)} />
              <Row label="Selling price" value={formatCurrency(product.sellingPrice)} />
              <Row label="Estimated fees" value={formatCurrency(product.fees)} />
            </dl>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-sm font-medium">Estimated profit</span>
              <span
                className={cn(
                  "font-display text-xl font-semibold",
                  profit >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {formatCurrency(profit)}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm font-medium">Profit margin</span>
              <span
                className={cn(
                  "font-display text-xl font-semibold",
                  margin >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {formatPercent(margin)}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Total at {product.quantity} units: {formatCurrency(profit * product.quantity)}
            </p>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-base font-semibold">Research status</h2>
            <div className="mt-3 flex items-center gap-3">
              <StatusBadge status={product.status} />
            </div>
            <div className="mt-3 space-y-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Change status
              </label>
              <Select
                value={product.status}
                onValueChange={(value) => {
                  setProductStatus(product.id, value as ProductStatus);
                  toast.success(`Status updated to ${value}.`);
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this product?"
        description="This removes the product from your prototype workspace."
        confirmLabel="Delete Product"
        onConfirm={() => {
          deleteProduct(product.id);
          toast.success("Product deleted.");
          navigate({ to: "/products" });
        }}
      />
    </AppLayout>
  );
}
