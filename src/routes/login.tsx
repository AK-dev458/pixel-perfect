import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | ProfitScout Wholesale Research" },
      {
        name: "description",
        content:
          "Sign in to ProfitScout to track Amazon wholesale products, suppliers, costs, fees and profit margins.",
      },
      { property: "og:title", content: "Sign in | ProfitScout Wholesale Research" },
      {
        property: "og:description",
        content: "Amazon wholesale product research dashboard for sellers and researchers.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, member } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  useEffect(() => {
    if (member) navigate({ to: "/dashboard", replace: true });
  }, [member, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const result = login(email, password);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    toast.success("Welcome back to ProfitScout.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="auth-backdrop flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5 text-primary-foreground">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="size-5" aria-hidden />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-secondary">
            ProfitScout
          </span>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <h1 className="font-display text-xl font-semibold">Sign in to your workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Amazon wholesale product research dashboard.
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

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined, form: undefined }));
                }}
                placeholder="demo@profitscout.com"
                aria-invalid={!!errors.email}
              />
              {errors.email ? (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: undefined, form: undefined }));
                }}
                placeholder="demo123"
                aria-invalid={!!errors.password}
              />
              {errors.password ? (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.password}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register New Member
            </Link>
          </p>

          <div className="mt-5 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Demo access — email <span className="font-semibold">demo@profitscout.com</span>, password{" "}
            <span className="font-semibold">demo123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
