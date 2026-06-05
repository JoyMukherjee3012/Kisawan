import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { AuthShell, AuthField, authInputClass, authButtonClass } from "@/components/AuthShell";
import { auth } from "@/lib/firebase";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password — Kisawan" },
      { name: "description", content: "Set a new password for your Kisawan account." },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    if (!code) return;
    verifyPasswordResetCode(auth, code)
      .then(() => {
        setOobCode(code);
        setReady(true);
      })
      .catch(() => toast.error("Reset link is invalid or expired"));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!oobCode) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("Password updated. Please sign in.");
      navigate({ to: "/login" });
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle={
        ready
          ? "Choose a strong password to secure your account."
          : "Open the link from your email to continue."
      }
      footer={
        <>
          Back to{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="New password">
          <input
            type="password"
            required
            disabled={!ready}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            placeholder="At least 8 characters"
          />
        </AuthField>
        <AuthField label="Confirm new password">
          <input
            type="password"
            required
            disabled={!ready}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={authInputClass}
            placeholder="Repeat password"
          />
        </AuthField>
        <button type="submit" disabled={loading || !ready} className={authButtonClass}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
