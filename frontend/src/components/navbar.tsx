"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-indigo-500/50 transition-all">
                        R
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                        RemicoPay
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Calculate
                    </Link>
                    <Link href="/send" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Send Money
                    </Link>
                    <Link href="/status" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Track
                    </Link>
                    <Link href="/history" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        History
                    </Link>
                </div>

                {/* Wallet Connect */}
                <div suppressHydrationWarning>
                    <ConnectButton
                        showBalance={false}
                        accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                        }}
                    />
                </div>
            </div>
        </motion.nav>
    );
}
