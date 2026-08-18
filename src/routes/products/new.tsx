import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { ProductForm } from "@/components/ProductForm";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/new")({
  head: () => ({
    meta: [
      { title: "Add Product | ProfitScout" },
      {
        name: "description",
        content:
          "Add a wholesale product with cost, selling price and fees, and see estimated profit and margin update live.",
      },
      { property: "og:title", content: "Add Product | ProfitScout" },
      {
        property: "og:description",
        content: "Live profit calculator for new Amazon wholesale product research.",
      },
    ],
  }),
  component: NewProductPage,
});

function NewProductPage() {
  const { addProduct } = useStore();
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Add product"
      description="Enter sourcing details and review profitability before saving."
    >
      <ProductForm
        submitLabel="Save Product"
        onSubmit={(draft) => {
          addProduct(draft);
          toast.success("Product added successfully.");
          navigate({ to: "/products" });
        }}
        onCancel={() => navigate({ to: "/products" })}
      />
    </AppLayout>
  );
}
