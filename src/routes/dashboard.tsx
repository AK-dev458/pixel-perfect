import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  CircleDollarSign,
  Package,
  Percent,
  Plus,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent, productMargin, productProfit } from "@/lib/profit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | ProfitScout Wholesale Research" },
      {
        name: "description",
        content:
          "Track total products, research status, estimated profit and average margin across your Amazon wholesale pipeline.",
      },
      { property: "og:title", content: "Dashboard | ProfitScout Wholesale Research" },
      {
        property: "og:description",
        content: "KPIs, profitability chart and recent wholesale product research activity.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { products, supplierName } = useStore();

  const approved = products.filter((p) => p.status === "Approved");
  const researching = products.filter((p) => p.status === "Researching");
  const rejected = products.filter((p) => p.status === "Rejected");

  const totalProfit = products.reduce((sum, p) => sum + productProfit(p) * p.quantity, 0);
  const avgMargin = products.length
    ? products.reduce((sum, p) => sum + productMargin(p), 0) / products.length
    : 0;

  const chartData = [...products]
    .sort((a, b) => productProfit(b) - productProfit(a))
    .slice(0, 7)
    .map((p) => ({
      name: p.sku,
      profit: Number(productProfit(p).toFixed(2)),
      margin: Number(productMargin(p).toFixed(1)),
    }));

  const recent = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <AppLayout
      title="Dashboard"
      description="Your wholesale research pipeline at a glance."
      actions={
        <Button asChild>
          <Link to="/products/new">
            <Plus className="size-4" /> Add Product
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total Products" value={String(products.length)} icon={Package} />
        <KpiCard
          label="Researching"
          value={String(researching.length)}
          icon={Search}
          tone="info"
        />
        <KpiCard label="Approved" value={String(approved.length)} icon={BadgeCheck} tone="success" />
        <KpiCard
          label="Rejected"
          value={String(rejected.length)}
          icon={XCircle}
          tone="destructive"
        />
        <KpiCard
          label="Estimated Total Profit"
          value={formatCurrency(totalProfit)}
          hint="Unit profit × quantity across all products"
          icon={CircleDollarSign}
          tone="success"
        />
        <KpiCard
          label="Average Profit Margin"
          value={formatPercent(avgMargin)}
          hint="Mean margin across tracked products"
          icon={Percent}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Profitability by product</h2>
              <p className="text-xs text-muted-foreground">Top unit profit opportunities</p>
            </div>
          </div>
          <div className="mt-4 h-72 w-full">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -12, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      color: "var(--color-card-foreground)",
                      fontSize: 12,
                    }}
                    formatter={(value: number, key) =>
                      key === "profit" ? formatCurrency(value) : formatPercent(value)
                    }
                  />
                  <Bar dataKey="profit" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={Package}
                title="No profitability data yet"
                description="Add a product to see profit comparisons."
              />
            )}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-base font-semibold">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild className="justify-start">
              <Link to="/products/new">
                <Plus className="size-4" /> Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/products">
                <Package className="size-4" /> View Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/suppliers">
                <Truck className="size-4" /> View Suppliers
              </Link>
            </Button>
          </div>

          <h2 className="mt-6 text-base font-semibold">Recent products</h2>
          {recent.length ? (
            <ul className="mt-3 divide-y divide-border">
              {recent.map((p) => (
                <li key={p.id} className="py-3">
                  <Link
                    to="/products/$id"
                    params={{ id: p.id }}
                    className="group flex items-start justify-between gap-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium group-hover:text-primary">
                        {p.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {supplierName(p.supplierId)} · {formatCurrency(productProfit(p))} /unit
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
              title="No products yet"
              description="Add your first wholesale opportunity to start researching."
              action={
                <Button asChild>
                  <Link to="/products/new">Add Product</Link>
                </Button>
              }
            />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
