import type { Product } from "./mock-data";

export function estimatedProfit(sellingPrice: number, buyCost: number, fees: number) {
  return (sellingPrice || 0) - (buyCost || 0) - (fees || 0);
}

export function profitMargin(sellingPrice: number, buyCost: number, fees: number) {
  if (!sellingPrice) return 0;
  return (estimatedProfit(sellingPrice, buyCost, fees) / sellingPrice) * 100;
}

export function productProfit(product: Product) {
  return estimatedProfit(product.sellingPrice, product.buyCost, product.fees);
}

export function productMargin(product: Product) {
  return profitMargin(product.sellingPrice, product.buyCost, product.fees);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;
}
