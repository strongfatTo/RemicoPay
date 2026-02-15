import Link from "next/link";
import { Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-deep border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">RemicoPay</h3>
            <p className="text-sm text-white/60">
              The fastest and most secure way to exchange money globally.
            </p>
            <div className="flex space-x-4">
              <Link href="https://x.com/RemicoPay" className="text-white/40 hover:text-white/60">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  API Status
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-white/60 hover:text-white">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-base text-white/40">
            &copy; {new Date().getFullYear()} RemicoPay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
