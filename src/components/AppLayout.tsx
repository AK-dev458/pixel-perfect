import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Menu, Package, Truck, TrendingUp, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
] as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <TrendingUp className="size-5" aria-hidden />
      </span>
      {compact ? null : (
        <span className="font-display text-lg font-semibold tracking-tight">ProfitScout</span>
      )}
    </span>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1" aria-label="Main navigation">
      {NAV.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, displayName, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  if (!user) return null;

  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been signed out.");
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 bg-sidebar p-4 lg:flex">
        <div className="px-2 pt-2 text-sidebar-foreground">
          <BrandMark />
          <p className="mt-1 pl-11 text-xs text-sidebar-foreground/60">Wholesale research</p>
        </div>
        <NavLinks />
        <div className="mt-auto rounded-xl bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground/80">
          Signed in with Supabase — product data is mock and resets on refresh.
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-4 text-sidebar-foreground">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mb-6 px-2 pt-2">
                <BrandMark />
              </div>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">
            <BrandMark compact />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {actions ? <div className="hidden sm:flex sm:items-center sm:gap-2">{actions}</div> : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 px-2 sm:px-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block text-sm font-semibold">{displayName}</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="size-4" /> Member profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                ) : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-2 sm:hidden">{actions}</div> : null}
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
