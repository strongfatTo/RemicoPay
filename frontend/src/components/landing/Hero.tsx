"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
                        Live on Etherlink Testnet
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-tight"
                >
                    Send <span className="text-indigo-400">HKD</span> to{" "}
                    <span className="gradient-text-gold">Philippines</span>
                    <br />
                    <span className="text-white">Instantly.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    The fastest way to remit money using stablecoins. Low fees, instant settlement, and bank-grade security on the Etherlink network.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/send">
                        <Button size="lg" variant="gradient" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full">
                            Start Sending <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/status">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-white/10 hover:bg-white/5">
                            Track Transfer
                        </Button>
                    </Link>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8"
                >
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" /> Bank-Grade Security
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Zap className="w-5 h-5 text-yellow-400" /> Instant Settlement
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Globe className="w-5 h-5 text-blue-400" /> Best Exchange Rates
                    </div>
                </motion.div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-pulse-glow" />
        </section>
    );
}
