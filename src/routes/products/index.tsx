import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, Package, Pencil, Plus, SearchX, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUSES, type ProductStatus } from "@/lib/mock-data";
import { formatCurrency, formatPercent, productMargin, productProfit } from "@/lib/profit";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products | ProfitScout Wholesale Research" },
      {
        name: "description",
        content:
          "Search, filter and manage Amazon wholesale products with buy cost, fees, profit, margin and research status.",
      },
      { property: "og:title", content: "Products | ProfitScout Wholesale Research" },
      {
        property: "og:description",
        content: "Manage your wholesale product research list with profit and margin insights.",
      },
    ],
  }),
  component: ProductsPage,
});

type SortKey = "newest" | "profit" | "margin" | "name" | "price";

function ProductsPage() {
  const { products, suppliers, supplierName, setProductStatus, deleteProduct } = useStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [supplier, setSupplier] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.asin.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesStatus = status === "all" || p.status === status;
      const matchesSupplier = supplier === "all" || p.supplierId === supplier;
      return matchesSearch && matchesStatus && matchesSupplier;
    });

    return list.sort((a, b) => {
      if (sort === "profit") return productProfit(b) - productProfit(a);
      if (sort === "margin") return productMargin(b) - productMargin(a);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") return b.sellingPrice - a.sellingPrice;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [products, search, status, supplier, sort]);

  const hasFilters = !!search.trim() || status !== "all" || supplier !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSupplier("all");
  };

  const handleStatusChange = (id: string, next: ProductStatus) => {
    setProductStatus(id, next);
    toast.success(`Status updated to ${next}.`);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete);
    setPendingDelete(null);
    toast.success("Product deleted.");
  };

  const rowActions = (id: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate({ to: "/products/$id", params: { id } })}>
          <Eye className="size-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/products/$id/edit", params: { id } })}>
          <Pencil className="size-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuLabel className="pt-2 text-xs text-muted-foreground">
          Change status
        </DropdownMenuLabel>
        {STATUSES.map((s) => (
          <DropdownMenuItem key={s} onClick={() => handleStatusChange(id, s)}>
            {s}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          variant="destructive"
          onClick={() => setPendingDelete(id)}
          className="mt-1"
        >
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <AppLayout
      title="Products"
      description={`${products.length} wholesale opportunities tracked.`}
      actions={
        <Button asChild>
          <Link to="/products/new">
            <Plus className="size-4" /> Add Product
          </Link>
        </Button>
      }
    >
      <div className="surface-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, SKU, ASIN, category"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger id="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="supplier-filter">Supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger id="supplier-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All suppliers</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sort">Sort by</Label>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="profit">Highest profit</SelectItem>
                <SelectItem value="margin">Highest margin</SelectItem>
                <SelectItem value="price">Highest selling price</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState
            icon={Package}
            title="No products yet"
            description="No products yet. Add your first wholesale opportunity to start researching."
            action={
              <Button asChild>
                <Link to="/products/new">Add Product</Link>
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState
            icon={SearchX}
            title="No products match your search."
            description="Try a different keyword or reset your filters."
            action={
              <Button variant="outline" onClick={clearFilters} disabled={!hasFilters}>
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
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Buy</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        to="/products/$id"
                        params={{ id: p.id }}
                        className="block max-w-[16rem] truncate font-medium hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {p.sku} · {p.asin}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{supplierName(p.supplierId)}</TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(p.buyCost)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(p.sellingPrice)}
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(p.fees)}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right text-sm font-semibold",
                        productProfit(p) >= 0 ? "text-success" : "text-destructive",
                      )}
                    >
                      {formatCurrency(productProfit(p))}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right text-sm font-semibold",
                        productMargin(p) >= 0 ? "text-success" : "text-destructive",
                      )}
                    >
                      {formatPercent(productMargin(p))}
                    </TableCell>
                    <TableCell className="text-right text-sm">{p.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right">{rowActions(p.id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:hidden">
            {filtered.map((p) => (
              <article key={p.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to="/products/$id"
                    params={{ id: p.id }}
                    className="text-sm font-semibold hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.sku} · {p.asin} · {supplierName(p.supplierId)}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Buy cost</dt>
                    <dd>{formatCurrency(p.buyCost)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Selling price</dt>
                    <dd>{formatCurrency(p.sellingPrice)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Fees</dt>
                    <dd>{formatCurrency(p.fees)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Quantity</dt>
                    <dd>{p.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Profit</dt>
                    <dd
                      className={cn(
                        "font-semibold",
                        productProfit(p) >= 0 ? "text-success" : "text-destructive",
                      )}
                    >
                      {formatCurrency(productProfit(p))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Margin</dt>
                    <dd
                      className={cn(
                        "font-semibold",
                        productMargin(p) >= 0 ? "text-success" : "text-destructive",
                      )}
                    >
                      {formatPercent(productMargin(p))}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/products/$id" params={{ id: p.id }}>
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/products/$id/edit" params={{ id: p.id }}>
                      Edit
                    </Link>
                  </Button>
                  {rowActions(p.id)}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this product?"
        description="This removes the product from your prototype workspace."
        confirmLabel="Delete Product"
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
