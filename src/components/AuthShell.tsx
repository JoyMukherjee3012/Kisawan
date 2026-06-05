import { Link } from "@tanstack/react-router";
import { Leaf, Sparkles, Sprout, HeartPulse, Brain } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[140px]" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
        {/* Brand side */}
        <div className="hidden flex-col justify-between lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-neon glow-green">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Kisawan</span>
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI for Agriculture · Health · Climate
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Protecting <span className="text-gradient">farmers</span>
              <br /> and the <span className="text-gradient">farms</span> they tend.
            </h2>
            <p className="max-w-md text-muted-foreground">
              Join Kisawan to unite crop intelligence with your personal wellbeing — one dashboard, one AI.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Sprout className="h-4 w-4 text-primary-foreground" />, label: "Crop AI", chip: "bg-neon" },
                { icon: <HeartPulse className="h-4 w-4 text-primary-foreground" />, label: "Health", chip: "bg-cool" },
                { icon: <Brain className="h-4 w-4 text-primary-foreground" />, label: "Insights", chip: "bg-neon" },
              ].map((c) => (
                <div key={c.label} className="glass rounded-2xl p-3 text-center">
                  <span className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${c.chip}`}>{c.icon}</span>
                  <p className="mt-2 text-xs text-muted-foreground">{c.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Recurrex · Cultivating wellbeing with AI</p>
        </div>

        {/* Form side */}
        <div className="flex w-full items-center">
          <div className="glass-solid mx-auto w-full max-w-md rounded-3xl p-6 sm:p-8 animate-fade-up">
            <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon glow-green">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display text-lg font-semibold">Kisawan</span>
            </Link>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export const authInputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-primary/30 focus:shadow-[0_0_0_4px_oklch(0.85_0.22_150/0.08)]";

export const authButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-6 py-3 text-sm font-semibold text-primary-foreground glow-green transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100";
