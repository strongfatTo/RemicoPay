"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRightLeft, Clock, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/send", label: "Send", icon: ArrowRightLeft },
  { href: "/status", label: "Status", icon: Clock },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 pt-6 px-4"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group bg-brand-deep/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-lg">
          <span className="font-heading text-xl font-bold text-white transition-colors group-hover:text-white/90">
            Remico
          </span>
          <span className="font-heading text-xl font-bold text-neon-mint transition-all">
            Pay
          </span>
          <motion.span
            className="ml-0.5 text-brand-mint"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </Link>

        {/* Navigation - Tubelight Style */}
        <nav className="hidden md:flex items-center gap-1 bg-brand-navy/50 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = activeTab === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setActiveTab(href)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                  "text-white/60 hover:text-brand-mint",
                  isActive && "text-brand-mint bg-brand-mint/10"
                )}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-brand-mint/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-mint rounded-t-full">
                      <div className="absolute w-12 h-6 bg-brand-mint/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-brand-mint/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-brand-mint/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Nav (Bottom) */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 flex md:hidden items-center gap-1 bg-brand-navy/50 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg z-50">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = activeTab === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setActiveTab(href)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                  "text-white/60 hover:text-brand-mint",
                  isActive && "text-brand-mint bg-brand-mint/10"
                )}
              >
                <span className="sr-only">{label}</span>
                <Icon size={20} strokeWidth={2.5} />
                {isActive && (
                  <motion.div
                    layoutId="lamp-mobile"
                    className="absolute inset-0 w-full bg-brand-mint/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-mint rounded-t-full">
                      <div className="absolute w-12 h-6 bg-brand-mint/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-brand-mint/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-brand-mint/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center bg-brand-deep/50 backdrop-blur-md rounded-full border border-white/5 shadow-lg p-1">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </motion.header>
  );
}
