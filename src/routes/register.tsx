import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, MailCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register a member | ProfitScout" },
      {
        name: "description",
        content:
          "Create a ProfitScout member account to research Amazon wholesale products, suppliers and profit margins.",
      },
      { property: "og:title", content: "Register a member | ProfitScout" },
      {
        property: "og:description",
        content: "Create a ProfitScout member account for wholesale product research.",
      },
    ],
  }),
  component: RegisterPage,
});

type Fields = { name: string; email: string; password: string; confirm: string };

function RegisterPage() {
  const { signUp } = useAuth();
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  type FieldErrors = { [K in keyof Fields]?: string | undefined } & { form?: string | undefined };
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: FieldErrors = {};
    if (!fields.name.trim()) next.name = "Full name is required.";
    if (!fields.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      next.email = "Enter a valid email address.";
    if (!fields.password) next.password = "Password is required.";
    else if (fields.password.length < 6) next.password = "Use at least 6 characters.";
    if (!fields.confirm) next.confirm = "Confirm your password.";
    else if (fields.confirm !== fields.password) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    const result = await signUp(fields.name, fields.email, fields.password);
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ form: result.error ?? "Could not create your account." });
      return;
    }
    setSent(true);
    toast.success("Account created — check your email to confirm.");
  };

  const field = (key: keyof Fields, label: string, type = "text", autoComplete?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        autoComplete={autoComplete}
        value={fields[key]}
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
    <div className="auth-backdrop flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="size-5" aria-hidden />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-secondary">
            ProfitScout
          </span>
        </div>

        <div className="surface-card p-6 sm:p-8">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="size-6" aria-hidden />
              </span>
              <h1 className="mt-4 font-display text-xl font-semibold">Confirm your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a confirmation link to{" "}
                <span className="font-semibold text-foreground">{fields.email}</span>. Click it to
                activate your account, then sign in.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-xl font-semibold">Register new member</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your ProfitScout account with an email and password.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                {errors.form ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{errors.form}</span>
                  </div>
                ) : null}
                {field("name", "Full name", "text", "name")}
                {field("email", "Email", "email", "email")}
                {field("password", "Password", "password", "new-password")}
                {field("confirm", "Confirm password", "password", "new-password")}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating account…" : "Register"}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
