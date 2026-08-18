import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  DEMO_CREDENTIALS,
  MOCK_PRODUCTS,
  MOCK_SUPPLIERS,
  type Product,
  type ProductStatus,
  type Supplier,
} from "./mock-data";

export type Member = { name: string; email: string };

export type ProductDraft = Omit<Product, "id" | "status" | "createdAt">;
export type SupplierDraft = Omit<Supplier, "id">;

type StoreValue = {
  member: Member | null;
  products: Product[];
  suppliers: Supplier[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (member: Member) => void;
  logout: () => void;
  addProduct: (draft: ProductDraft) => Product;
  updateProduct: (id: string, draft: ProductDraft) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (draft: SupplierDraft) => Supplier;
  updateSupplier: (id: string, draft: SupplierDraft) => void;
  getProduct: (id: string) => Product | undefined;
  getSupplier: (id: string) => Supplier | undefined;
  supplierName: (id: string) => string;
  productCountForSupplier: (id: string) => number;
};

const StoreContext = createContext<StoreValue | null>(null);

const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [registered, setRegistered] = useState<Array<Member & { password?: string }>>([]);

  const login = useCallback<StoreValue["login"]>(
    (email, password) => {
      const normalized = email.trim().toLowerCase();
      if (normalized === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        setMember({ name: DEMO_CREDENTIALS.name, email: DEMO_CREDENTIALS.email });
        return { ok: true };
      }
      const found = registered.find((m) => m.email.toLowerCase() === normalized);
      if (found && found.password === password) {
        setMember({ name: found.name, email: found.email });
        return { ok: true };
      }
      return { ok: false, error: "Invalid email or password. Try demo@profitscout.com / demo123." };
    },
    [registered],
  );

  const register = useCallback((next: Member & { password?: string }) => {
    setRegistered((prev) => [...prev, next]);
  }, []);

  const logout = useCallback(() => setMember(null), []);

  const addProduct = useCallback<StoreValue["addProduct"]>((draft) => {
    const product: Product = {
      ...draft,
      id: newId("prd"),
      status: "Researching",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  }, []);

  const updateProduct = useCallback<StoreValue["updateProduct"]>((id, draft) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...draft } : p)));
  }, []);

  const setProductStatus = useCallback<StoreValue["setProductStatus"]>((id, status) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  const deleteProduct = useCallback<StoreValue["deleteProduct"]>((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addSupplier = useCallback<StoreValue["addSupplier"]>((draft) => {
    const supplier: Supplier = { ...draft, id: newId("sup") };
    setSuppliers((prev) => [supplier, ...prev]);
    return supplier;
  }, []);

  const updateSupplier = useCallback<StoreValue["updateSupplier"]>((id, draft) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...draft } : s)));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      member,
      products,
      suppliers,
      login,
      register,
      logout,
      addProduct,
      updateProduct,
      setProductStatus,
      deleteProduct,
      addSupplier,
      updateSupplier,
      getProduct: (id) => products.find((p) => p.id === id),
      getSupplier: (id) => suppliers.find((s) => s.id === id),
      supplierName: (id) => suppliers.find((s) => s.id === id)?.name ?? "Unassigned",
      productCountForSupplier: (id) => products.filter((p) => p.supplierId === id).length,
    }),
    [
      member,
      products,
      suppliers,
      login,
      register,
      logout,
      addProduct,
      updateProduct,
      setProductStatus,
      deleteProduct,
      addSupplier,
      updateSupplier,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
