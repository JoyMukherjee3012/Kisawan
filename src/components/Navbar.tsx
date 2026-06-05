import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Leaf, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

type NavLink =
  | { to: "/" | "/features" | "/dashboard" | "/about"; label: string; href?: undefined }
  | { href: string; label: string; to?: undefined };

const links: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { href: "mailto:recurrex.ofc@gmail.com", label: "Contact" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "";
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate({ to: "/" });
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto mt-3 max-w-6xl px-3 sm:mt-4 sm:px-4">
        <nav className="glass flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neon glow-green">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="truncate font-display text-base font-semibold tracking-tight sm:text-lg">
              Kisawan
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const key = l.to ?? l.href!;
              const active = l.to && (pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to)));
              const cls = `rounded-full px-3 py-2 text-sm transition-colors lg:px-4 ${
                active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`;
              return (
                <li key={key}>
                  {l.to ? (
                    <Link to={l.to} className={cls}>{l.label}</Link>
                  ) : (
                    <a href={l.href} className={cls}>{l.label}</a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1.5 pr-3 text-sm hover:bg-white/10"
                  title={displayName}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-neon text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="max-w-[120px] truncate">{displayName.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-neon px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-foreground hover:bg-white/10 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass-solid mt-2 overflow-hidden rounded-2xl p-2 md:hidden animate-fade-up">
            <ul className="flex flex-col">
              {links.map((l) => {
                const key = l.to ?? l.href!;
                const active = l.to && (pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to)));
                const cls = `block rounded-xl px-4 py-3 text-sm transition-colors ${
                  active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`;
                return (
                  <li key={key}>
                    {l.to ? (
                      <Link to={l.to} className={cls} onClick={() => setOpen(false)}>{l.label}</Link>
                    ) : (
                      <a href={l.href} className={cls} onClick={() => setOpen(false)}>{l.label}</a>
                    )}
                  </li>
                );
              })}
              <li className="mt-2 border-t border-white/10 p-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-neon text-sm font-semibold text-primary-foreground">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
                    >
                      <User className="h-4 w-4" /> Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-neon px-4 py-3 text-center text-sm font-medium text-primary-foreground"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
