import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Package, Pencil, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { SupplierDialog } from "@/components/SupplierDialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent, productMargin, productProfit } from "@/lib/profit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/suppliers/$id")({
  head: () => ({
    meta: [
      { title: "Supplier Details | ProfitScout" },
      {
        name: "description",
        content:
          "Supplier contact information, sourcing notes and the wholesale products associated with this supplier.",
      },
      { property: "og:title", content: "Supplier Details | ProfitScout" },
      {
        property: "og:description",
        content: "Contact details and associated wholesale products for this supplier.",
      },
    ],
  }),
  component: SupplierDetailsPage,
});

function SupplierDetailsPage() {
  const { id } = Route.useParams();
  const { getSupplier, updateSupplier, products } = useStore();
  const [editing, setEditing] = useState(false);
  const supplier = getSupplier(id);

  if (!supplier) {
    return (
      <AppLayout title="Supplier not found">
        <div className="surface-card">
          <EmptyState
            icon={Truck}
            title="Something went wrong. Please try again."
            description="This supplier is no longer in your prototype workspace."
            action={
              <Button asChild>
                <Link to="/suppliers">Try Again</Link>
              </Button>
            }
          />
        </div>
      </AppLayout>
    );
  }

  const associated = products.filter((p) => p.supplierId === supplier.id);
  const { id: _ignored, ...draft } = supplier;

  return (
    <AppLayout
      title={supplier.name}
      description={`${supplier.category} · ${associated.length} products`}
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/suppliers">
              <ArrowLeft className="size-4" /> Back
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="size-4" /> Edit
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <section className="surface-card p-5">
          <h2 className="text-base font-semibold">Supplier information</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Contact</dt>
              <dd className="text-right font-medium">{supplier.contactName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-right font-medium break-all">{supplier.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-right font-medium">{supplier.phone}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Website</dt>
              <dd className="text-right font-medium break-all">{supplier.website}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="text-right font-medium">{supplier.category}</dd>
            </div>
          </dl>
          <h3 className="mt-5 text-sm font-semibold">Notes</h3>
          <p className="mt-1 text-sm text-muted-foreground">{supplier.notes || "—"}</p>
        </section>

        <section className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-semibold">Associated products</h2>
            <p className="text-xs text-muted-foreground">
              Select a product to open its full research details.
            </p>
          </div>
          {associated.length ? (
            <ul className="divide-y divide-border">
              {associated.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/products/$id"
                    params={{ id: p.id }}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.sku} · {formatCurrency(productProfit(p))} profit ·{" "}
                        {formatPercent(productMargin(p))} margin
                      </span>
                    </span>
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Package}
              title="No products linked yet"
              description="Add a product and assign this supplier to see it here."
              action={
                <Button asChild>
                  <Link to="/products/new">Add Product</Link>
                </Button>
              }
            />
          )}
        </section>
      </div>

      {editing ? (
        <SupplierDialog
          open={editing}
          onOpenChange={setEditing}
          initial={draft}
          title="Edit supplier"
          submitLabel="Save Changes"
          onSubmit={(next) => {
            updateSupplier(supplier.id, next);
            setEditing(false);
            toast.success("Supplier updated successfully.");
          }}
        />
      ) : null}
    </AppLayout>
  );
}
