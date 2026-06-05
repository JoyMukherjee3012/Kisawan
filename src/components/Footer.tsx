import { Link } from "@tanstack/react-router";
import { Leaf, Twitter, Github, Linkedin, Mail, Instagram, Facebook } from "lucide-react";

const socials = [
  { href: "mailto:recurrex.ofc@gmail.com", icon: Mail, label: "Email" },
  { href: "https://github.com/Recurrex", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/company/recurrexhq/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com/recurrex", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com/recurrex", icon: Facebook, label: "Facebook" },
  { href: "https://x.com/recurrex", icon: Twitter, label: "X" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 bg-black/20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-neon">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-semibold">Recurrex</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Protecting both the farmer and the farm with intelligent AI.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li>
              <a href="mailto:recurrex.ofc@gmail.com" className="hover:text-foreground">
                Contact
              </a>
            </li>
            <li>
              <a href="mailto:recurrex.ofc@gmail.com" className="hover:text-foreground break-all">
                recurrex.ofc@gmail.com
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Follow</h4>
          <div className="flex flex-wrap gap-3 text-muted-foreground">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 transition-colors hover:bg-white/10 hover:text-primary"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Recurrex — Cultivating wellbeing with AI.
      </div>
    </footer>
  );
}
