import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Kisawan" },
      { name: "description", content: "Talk to the Kisawan team about pilots, partnerships, and support." },
    ],
  }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Contact</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Let's grow together.</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Pilots, partnerships, or support — drop us a line and we'll respond within a day.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          {[
            { i: <Mail className="h-5 w-5" />, t: "hello@kisawan.ai" },
            { i: <Phone className="h-5 w-5" />, t: "+91 98000 00000" },
            { i: <MapPin className="h-5 w-5" />, t: "Nashik · Bengaluru" },
          ].map((c, i) => (
            <div key={i} className="glass flex items-center gap-3 rounded-2xl p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-primary">{c.i}</span>
              <span className="text-sm">{c.t}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="glass space-y-4 rounded-2xl p-6 md:col-span-2"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" placeholder="Ravi Sharma" />
            <Field label="Email" placeholder="you@farm.com" type="email" />
          </div>
          <Field label="Subject" placeholder="Pilot in Nashik" />
          <div>
            <label className="text-xs text-muted-foreground">Message</label>
            <textarea
              rows={5}
              required
              placeholder="Tell us about your farm…"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-medium text-primary-foreground glow-green hover:scale-105">
            {sent ? "Sent ✓" : (<><Send className="h-4 w-4" /> Send message</>)}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        required
        {...props}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
