import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, SearchX, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";
import { SupplierDialog } from "@/components/SupplierDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/suppliers/")({
  head: () => ({
    meta: [
      { title: "Suppliers | ProfitScout Wholesale Research" },
      {
        name: "description",
        content:
          "Manage wholesale suppliers with contact details, categories and the number of products sourced from each.",
      },
      { property: "og:title", content: "Suppliers | ProfitScout Wholesale Research" },
      {
        property: "og:description",
        content: "Supplier directory for your Amazon wholesale sourcing pipeline.",
      },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const { suppliers, addSupplier, productCountForSupplier } = useStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.contactName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [suppliers, search]);

  return (
    <AppLayout
      title="Suppliers"
      description={`${suppliers.length} suppliers in your sourcing network.`}
      actions={
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" /> Add Supplier
        </Button>
      }
    >
      <div className="surface-card p-4 sm:p-5">
        <div className="max-w-sm space-y-1.5">
          <Label htmlFor="supplier-search">Search</Label>
          <Input
            id="supplier-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, contact, email, category"
          />
        </div>
      </div>

      {suppliers.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState
            icon={Truck}
            title="No suppliers yet"
            description="Add a supplier to link it to your wholesale products."
            action={<Button onClick={() => setDialogOpen(true)}>Add Supplier</Button>}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState
            icon={SearchX}
            title="No suppliers match your search."
            description="Try a different keyword."
            action={
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear Search
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="surface-card mt-6 hidden overflow-hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      <Link
                        to="/suppliers/$id"
                        params={{ id: s.id }}
                        className="hover:text-primary"
                      >
                        {s.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{s.contactName}</TableCell>
                    <TableCell className="text-sm">{s.email}</TableCell>
                    <TableCell className="text-sm">{s.phone}</TableCell>
                    <TableCell className="text-sm">{s.website}</TableCell>
                    <TableCell className="text-sm">{s.category}</TableCell>
                    <TableCell className="text-right text-sm">
                      {productCountForSupplier(s.id)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/suppliers/$id" params={{ id: s.id }}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:hidden">
            {filtered.map((s) => (
              <article key={s.id} className="surface-card p-4">
                <h2 className="text-sm font-semibold">{s.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.category} · {productCountForSupplier(s.id)} products
                </p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Contact</dt>
                    <dd className="text-right">{s.contactName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="truncate text-right">{s.email}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="text-right">{s.phone}</dd>
                  </div>
                </dl>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/suppliers/$id" params={{ id: s.id }}>
                    View supplier
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </>
      )}

      {dialogOpen ? (
        <SupplierDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Add supplier"
          submitLabel="Save Supplier"
          onSubmit={(draft) => {
            addSupplier(draft);
            setDialogOpen(false);
            toast.success("Supplier created successfully.");
          }}
        />
      ) : null}
    </AppLayout>
  );
}
