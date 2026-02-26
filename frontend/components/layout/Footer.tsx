import Link from "next/link";
import { Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-20 rounded-t-[4rem] border-t border-white/[0.06]"
      style={{ backgroundColor: "#0D0D12" }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-0.5">
              <span className="font-heading text-lg font-bold text-brand-ivory">Remico</span>
              <span className="font-heading text-lg font-bold" style={{ color: "#C9A84C" }}>Pay</span>
            </div>
            <p className="text-sm text-brand-ivory/45 leading-relaxed max-w-[200px]">
              Precision remittance infrastructure built on Etherlink.
            </p>
            <Link
              href="https://x.com/RemicoPay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-ivory/35 transition-colors duration-200 hover:text-brand-champagne link-lift"
              style={{ color: undefined }}
            >
              <Twitter className="h-4 w-4" />
              <span className="text-xs font-mono">@RemicoPay</span>
            </Link>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-ivory/30 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {["About", "Careers", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-brand-ivory/50 transition-all duration-200 hover:text-brand-champagne link-lift inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-ivory/30 mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {["Help Center", "Contact Us", "API Status"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-brand-ivory/50 transition-all duration-200 hover:text-brand-champagne link-lift inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-ivory/30 mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Compliance"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-brand-ivory/50 transition-all duration-200 hover:text-brand-champagne link-lift inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-ivory/25 font-mono">
            © {new Date().getFullYear()} RemicoPay. All rights reserved.
          </p>

          {/* System status indicator */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 py-1.5">
            <span className="status-dot" />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#C9A84C" }}
            >
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
