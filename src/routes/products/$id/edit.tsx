import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { PackageX } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";
import { ProductForm } from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Product | ProfitScout" },
      {
        name: "description",
        content:
          "Edit wholesale product details, recalculate estimated profit and margin, and save your changes.",
      },
      { property: "og:title", content: "Edit Product | ProfitScout" },
      {
        property: "og:description",
        content: "Update cost, price and fee assumptions for a wholesale product.",
      },
    ],
  }),
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const { getProduct, updateProduct } = useStore();
  const navigate = useNavigate();
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

  const { id: _id, status: _status, createdAt: _createdAt, ...draft } = product;

  return (
    <AppLayout title="Edit product" description={product.name}>
      <ProductForm
        initial={draft}
        submitLabel="Save Changes"
        onSubmit={(next) => {
          updateProduct(product.id, next);
          toast.success("Product updated successfully.");
          navigate({ to: "/products/$id", params: { id: product.id } });
        }}
        onCancel={() => navigate({ to: "/products/$id", params: { id: product.id } })}
      />
    </AppLayout>
  );
}
