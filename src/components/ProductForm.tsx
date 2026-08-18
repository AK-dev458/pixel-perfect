import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/mock-data";
import { estimatedProfit, formatCurrency, formatPercent, profitMargin } from "@/lib/profit";
import { useStore, type ProductDraft } from "@/lib/store";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  sku: string;
  asin: string;
  category: string;
  supplierId: string;
  buyCost: string;
  sellingPrice: string;
  fees: string;
  quantity: string;
  notes: string;
};

const emptyForm: FormState = {
  name: "",
  sku: "",
  asin: "",
  category: "",
  supplierId: "",
  buyCost: "",
  sellingPrice: "",
  fees: "",
  quantity: "",
  notes: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ProductDraft;
  submitLabel: string;
  onSubmit: (draft: ProductDraft) => void;
  onCancel: () => void;
}) {
  const { suppliers } = useStore();
  const navigate = useNavigate();
  void navigate;

  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          name: initial.name,
          sku: initial.sku,
          asin: initial.asin,
          category: initial.category,
          supplierId: initial.supplierId,
          buyCost: String(initial.buyCost),
          sellingPrice: String(initial.sellingPrice),
          fees: String(initial.fees),
          quantity: String(initial.quantity),
          notes: initial.notes,
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const numbers = useMemo(
    () => ({
      buyCost: Number(form.buyCost) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      fees: Number(form.fees) || 0,
    }),
    [form.buyCost, form.sellingPrice, form.fees],
  );

  const profit = estimatedProfit(numbers.sellingPrice, numbers.buyCost, numbers.fees);
  const margin = profitMargin(numbers.sellingPrice, numbers.buyCost, numbers.fees);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Product name is required.";
    if (!form.sku.trim()) next.sku = "SKU is required.";
    if (!form.asin.trim()) next.asin = "ASIN is required.";
    if (!form.category) next.category = "Select a category.";
    if (!form.supplierId) next.supplierId = "Select a supplier.";
    if (form.buyCost === "" || Number(form.buyCost) < 0) next.buyCost = "Enter a valid buy cost.";
    if (form.sellingPrice === "" || Number(form.sellingPrice) <= 0)
      next.sellingPrice = "Enter a selling price greater than 0.";
    if (form.fees === "" || Number(form.fees) < 0) next.fees = "Enter valid estimated fees.";
    if (form.quantity === "" || Number(form.quantity) < 1)
      next.quantity = "Enter a quantity of at least 1.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      asin: form.asin.trim().toUpperCase(),
      category: form.category,
      supplierId: form.supplierId,
      buyCost: Number(form.buyCost),
      sellingPrice: Number(form.sellingPrice),
      fees: Number(form.fees),
      quantity: Number(form.quantity),
      notes: form.notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <section className="surface-card p-5">
          <h2 className="text-base font-semibold">Product information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Stoneware 12-Piece Dinnerware Set"
                aria-invalid={!!errors.name}
              />
              <FieldError message={errors.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => set("sku")(e.target.value)}
                placeholder="NW-DINE-12S"
                aria-invalid={!!errors.sku}
              />
              <FieldError message={errors.sku} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="asin">ASIN</Label>
              <Input
                id="asin"
                value={form.asin}
                onChange={(e) => set("asin")(e.target.value)}
                placeholder="B08KQ4M2XT"
                aria-invalid={!!errors.asin}
              />
              <FieldError message={errors.asin} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={set("category")}>
                <SelectTrigger id="category" aria-invalid={!!errors.category}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.category} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={form.supplierId} onValueChange={set("supplierId")}>
                <SelectTrigger id="supplier" aria-invalid={!!errors.supplierId}>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.supplierId} />
            </div>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-base font-semibold">Costs & pricing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="buyCost">Buy cost (per unit)</Label>
              <Input
                id="buyCost"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={form.buyCost}
                onChange={(e) => set("buyCost")(e.target.value)}
                aria-invalid={!!errors.buyCost}
              />
              <FieldError message={errors.buyCost} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sellingPrice">Selling price</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={form.sellingPrice}
                onChange={(e) => set("sellingPrice")(e.target.value)}
                aria-invalid={!!errors.sellingPrice}
              />
              <FieldError message={errors.sellingPrice} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fees">Estimated fees</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={form.fees}
                onChange={(e) => set("fees")(e.target.value)}
                aria-invalid={!!errors.fees}
              />
              <FieldError message={errors.fees} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={form.quantity}
                onChange={(e) => set("quantity")(e.target.value)}
                aria-invalid={!!errors.quantity}
              />
              <FieldError message={errors.quantity} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Sourcing notes, gating, competition, freight terms..."
              />
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="surface-card p-5">
          <h2 className="text-base font-semibold">Live profit calculator</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Selling price</dt>
              <dd className="font-medium">{formatCurrency(numbers.sellingPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Buy cost</dt>
              <dd className="font-medium">-{formatCurrency(numbers.buyCost)}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Estimated fees</dt>
              <dd className="font-medium">-{formatCurrency(numbers.fees)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <dt className="font-medium">Estimated profit</dt>
              <dd
                className={cn(
                  "font-display text-xl font-semibold",
                  profit >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {formatCurrency(profit)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="font-medium">Profit margin</dt>
              <dd
                className={cn(
                  "font-display text-xl font-semibold",
                  margin >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {formatPercent(margin)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Profit = selling price − buy cost − estimated fees
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </aside>
    </form>
  );
}
