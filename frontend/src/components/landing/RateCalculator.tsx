"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRightLeft, Info } from "lucide-react";

export default function RateCalculator() {
    const [hkdAmount, setHkdAmount] = useState<number>(1000);
    const [phpAmount, setPhpAmount] = useState<number>(0);
    const [rate, setRate] = useState<number>(7.25); // Mock rate
    const feePercent = 0.007; // 0.7%

    useEffect(() => {
        // Simple mock calculation logic
        const amountAfterFee = hkdAmount * (1 - feePercent);
        setPhpAmount(amountAfterFee * rate);
    }, [hkdAmount, rate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto px-4 -mt-10 relative z-20"
        >
            <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
                {/* Glow behind card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none -z-10" />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-heading font-semibold">Exchange Rate</h3>
                    <div className="flex items-center gap-2 text-xs font-mono bg-secondary/50 px-3 py-1 rounded-full text-green-400 border border-green-500/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        1 HKD = {rate} PHP
                    </div>
                </div>

                <div className="space-y-4">
                    {/* You Send */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground ml-1">You Send</label>
                        <div className="relative group">
                            <input
                                type="number"
                                value={hkdAmount}
                                onChange={(e) => setHkdAmount(Number(e.target.value))}
                                className="w-full bg-secondary/80 border border-white/5 rounded-2xl px-5 py-4 text-2xl font-bold font-mono outline-none focus:ring-2 focus:ring-primary/50 transition-all group-hover:bg-secondary"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-sm font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">HKD</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative h-8 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative bg-secondary/40 p-2 rounded-full border border-white/10 backdrop-blur-md">
                            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Recipient Gets */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground ml-1">Recipient Gets</label>
                        <div className="relative">
                            <div className="w-full bg-secondary/30 border border-white/5 rounded-2xl px-5 py-4 text-2xl font-bold font-mono text-green-400 flex items-center justify-between">
                                <CountUp
                                    end={phpAmount}
                                    decimals={2}
                                    separator=","
                                    duration={0.5}
                                    preserveValue={true}
                                />
                                <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md ml-2">PHP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fees */}
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span>Fees included (0.7%)</span>
                        <Info className="w-3 h-3 hover:text-white cursor-help transition-colors" />
                    </div>
                    <span className="font-mono text-white">
                        ≈ {((hkdAmount * feePercent) * rate).toFixed(2)} PHP
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
