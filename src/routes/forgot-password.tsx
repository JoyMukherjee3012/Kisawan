import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, AuthField, authInputClass, authButtonClass } from "@/components/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Forgot Password — Kisawan" },
      { name: "description", content: "Reset your Kisawan account password." },
    ],
  }),
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    setSent(true);
    toast.success("If that email exists, a reset link is on the way.");
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="We'll email you a secure link to set a new password."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm">
          <p className="font-medium text-foreground">Check your inbox</p>
          <p className="mt-1 text-muted-foreground">
            We sent a password reset link to <span className="text-foreground">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              placeholder="you@kisawan.app"
            />
          </AuthField>
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
