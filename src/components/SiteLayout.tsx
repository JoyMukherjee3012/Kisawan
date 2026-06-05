import { Outlet, useLocation } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatbotAssistant } from "./ChatbotAssistant";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password", "/welcome"];

function LayoutChrome({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isAuthRoute) {
    return <>{children ?? <Outlet />}</>;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="pt-24 pb-24 sm:pt-28">{children ?? <Outlet />}</main>
      <Footer />
      {user && <ChatbotAssistant />}
    </div>
  );
}

export function SiteLayout({ children }: { children?: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutChrome>{children}</LayoutChrome>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
