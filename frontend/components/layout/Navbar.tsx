"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRightLeft, Clock, History, Home, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/send", label: "Send", icon: ArrowRightLeft },
  { href: "/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/status", label: "Status", icon: Clock },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<Element | null>(null);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4"
    >
      {/* Floating pill container */}
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "rgba(13,13,18,0.72)"
            : "rgba(13,13,18,0.0)",
          borderColor: scrolled
            ? "rgba(201,168,76,0.15)"
            : "rgba(255,255,255,0.0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex items-center justify-between w-full max-w-5xl h-14 px-3 rounded-full border"
        style={{ boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-0.5 group pl-2 pr-4 link-lift"
        >
          <span className="font-heading text-xl font-bold tracking-tight text-brand-ivory/90 transition-colors group-hover:text-brand-ivory">
            Remico
          </span>
          <span
            className="font-heading text-xl font-bold tracking-tight"
            style={{ color: "#C9A84C" }}
          >
            Pay
          </span>
          <motion.span
            className="ml-0.5"
            style={{ color: "#C9A84C" }}
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm py-1 px-1 rounded-full">
          {navLinks.map(({ href, label }) => {
            const isActive = activeTab === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setActiveTab(href)}
                className={cn(
                  "relative cursor-pointer text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 link-lift",
                  isActive
                    ? "text-brand-obsidian"
                    : "text-brand-ivory/50 hover:text-brand-ivory/90"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ backgroundColor: "#C9A84C" }}
                    transition={{ type: "spring", stiffness: 340, damping: 32 }}
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet button */}
        <div className="flex items-center rounded-full border border-white/[0.07] bg-white/[0.04] p-1">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </motion.div>

      {/* Mobile bottom dock */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 flex md:hidden items-center gap-0.5 bg-brand-obsidian/80 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-xl z-50">
        {navLinks.map(({ href, icon: Icon }) => {
          const isActive = activeTab === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setActiveTab(href)}
              className={cn(
                "relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300",
                isActive ? "text-brand-obsidian" : "text-brand-ivory/50 hover:text-brand-ivory/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill-mobile"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ backgroundColor: "#C9A84C" }}
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                />
              )}
              <Icon size={19} strokeWidth={2} />
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
