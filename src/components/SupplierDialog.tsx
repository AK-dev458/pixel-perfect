import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { SupplierDraft } from "@/lib/store";

type Errors = { [K in keyof SupplierDraft]?: string | undefined };

const empty: SupplierDraft = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  category: "",
  notes: "",
};

export function SupplierDialog({
  open,
  onOpenChange,
  initial,
  title,
  submitLabel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: SupplierDraft;
  title: string;
  submitLabel: string;
  onSubmit: (draft: SupplierDraft) => void;
}) {
  const [form, setForm] = useState<SupplierDraft>(initial ?? empty);
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof SupplierDraft) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Supplier name is required.";
    if (!form.contactName.trim()) next.contactName = "Contact name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone is required.";
    if (!form.category) next.category = "Select a category.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({
      ...form,
      name: form.name.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
    });
  };

  const text = (key: keyof SupplierDraft, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={`sup-${key}`}>{label}</Label>
      <Input
        id={`sup-${key}`}
        type={type}
        value={form[key]}
        onChange={(e) => set(key)(e.target.value)}
        aria-invalid={!!errors[key]}
      />
      {errors[key] ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {errors[key]}
        </p>
      ) : null}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Supplier records stay in this prototype session.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {text("name", "Supplier name")}
            {text("contactName", "Contact name")}
            {text("email", "Email", "email")}
            {text("phone", "Phone", "tel")}
            {text("website", "Website")}
            <div className="space-y-1.5">
              <Label htmlFor="sup-category">Category</Label>
              <Select value={form.category} onValueChange={set("category")}>
                <SelectTrigger id="sup-category" aria-invalid={!!errors.category}>
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
              {errors.category ? (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.category}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sup-notes">Notes</Label>
            <Textarea
              id="sup-notes"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
