import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell, AuthField, authInputClass, authButtonClass } from "@/components/AuthShell";
import { useAuth } from "@/lib/auth-context";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Log In — Kisawan" },
      { name: "description", content: "Sign in to your Kisawan dashboard." },
    ],
  }),
});

function LoginPage() {
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Welcome to Kisawan");
    navigate({ to: search.redirect ?? "/dashboard" });
  }
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate({ to: "/dashboard" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      toast.error(error.includes("Invalid") ? "Invalid email or password" : error);
      return;
    }
    toast.success("Welcome back to Kisawan");
    navigate({ to: search.redirect ?? "/dashboard" });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue protecting your farm and your wellbeing."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Email">
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder="you@kisawan.app"
          />
        </AuthField>

        <AuthField label="Password">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${authInputClass} pr-11`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </AuthField>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="relative my-1 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-white/10 disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.3 5.2C41.7 35.7 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
          )}
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
}
