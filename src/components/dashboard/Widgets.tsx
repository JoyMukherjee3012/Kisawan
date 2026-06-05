import type { ReactNode } from "react";

export function StatCard({
  icon,
  label,
  value,
  unit,
  hint,
  accent = "green",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  accent?: "green" | "blue" | "teal";
}) {
  const ring =
    accent === "green" ? "ring-primary/40" : accent === "blue" ? "ring-accent/40" : "ring-secondary/40";
  const glow =
    accent === "green" ? "bg-primary/15 text-primary" : accent === "blue" ? "bg-accent/15 text-accent" : "bg-secondary/15 text-secondary";
  return (
    <div className={`glass rounded-2xl p-5 ring-1 ${ring} transition-transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${glow}`}>{icon}</div>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
          {value}
          {unit && <span className="ml-1 text-base text-muted-foreground">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export function GaugeRing({
  value,
  size = 140,
  label,
  sub,
  color = "var(--neon)",
}: {
  value: number; // 0..100
  size?: number;
  label: string;
  sub?: string;
  color?: string;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div
      className="relative mx-auto flex aspect-square w-full max-w-[160px] items-center justify-center"
      style={{ maxWidth: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <p className="font-display text-xl font-semibold leading-none sm:text-2xl">{value}%</p>
        <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{label}</p>
        {sub && <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-[10px]">{sub}</p>}
      </div>
    </div>
  );
}
