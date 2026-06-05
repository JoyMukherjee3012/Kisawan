import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell, AuthField, authInputClass, authButtonClass } from "@/components/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign Up — Kisawan" },
      { name: "description", content: "Create your Kisawan account." },
    ],
  }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
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
    navigate({ to: "/dashboard" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ fullName, email, dateOfBirth, password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { error } = await signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      fullName: parsed.data.fullName,
      dateOfBirth: parsed.data.dateOfBirth,
    });
    setLoading(false);
    if (error) {
      if (error.toLowerCase().includes("registered") || error.toLowerCase().includes("exists")) {
        toast.error("This email is already registered. Try signing in.");
      } else {
        toast.error(error);
      }
      return;
    }
    toast.success("Account created. Welcome to Kisawan!");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Kisawan and bring AI to your farm and your wellbeing."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Full name">
          <input
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={authInputClass}
            placeholder="Ravi Sharma"
          />
        </AuthField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Date of birth">
            <input
              type="date"
              required
              value={dateOfBirth}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={authInputClass}
            />
          </AuthField>
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
        </div>

        <AuthField label="Password">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${authInputClass} pr-11`}
              placeholder="At least 8 characters"
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

        <AuthField label="Confirm password">
          <input
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={authInputClass}
            placeholder="Repeat password"
          />
        </AuthField>

        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {loading ? "Creating account…" : "Create Account"}
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
