import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MailCheck, RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { auth as fbAuth } from "@/lib/firebase";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading, emailVerified, resendVerification, reloadUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!emailVerified) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
        <div className="glass-solid w-full rounded-3xl p-8 text-center animate-fade-up">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-neon glow-green">
            <MailCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl">Verify your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification link to <span className="text-foreground">{user.email}</span>.
            Click the link, then refresh to continue.
          </p>
          <div className="mt-6 grid gap-2">
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await reloadUser();
                setBusy(false);
                if (!fbAuth.currentUser?.emailVerified) {
                  toast.error("Still not verified. Check your inbox.");
                }
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-sm font-semibold text-primary-foreground glow-green disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              I've verified, refresh
            </button>
            <button
              onClick={async () => {
                const { error } = await resendVerification();
                if (error) toast.error(error);
                else toast.success("Verification email sent");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
            >
              Resend verification email
            </button>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
