"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatusPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "found">("idle");

    const handleSearch = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStatus("found");
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 max-w-2xl pt-10">
            <h1 className="text-3xl font-bold font-heading mb-8 text-center">Track Transfer</h1>

            {/* Search Box */}
            <div className="glass-card p-2 rounded-2xl flex items-center gap-2 mb-12">
                <div className="pl-4 text-muted-foreground">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder="Enter Transaction Hash or Reference ID"
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm md:text-base placeholder:text-muted-foreground/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={!searchQuery || loading}>
                    {loading ? "Searching..." : "Track"}
                </Button>
            </div>

            {/* Result Card */}
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full rounded-3xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
            ) : status === "found" ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 md:p-8 rounded-3xl"
                >
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Status</div>
                            <div className="text-xl font-bold text-green-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Completed
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">Amount</div>
                            <div className="text-xl font-bold text-white">1,000.00 <span className="text-sm text-indigo-400">HKD</span></div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-8 relative pl-4">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-secondary" />

                        {[
                            { title: "Transfer Initiated", time: "10:30 AM", active: true, icon: Clock },
                            { title: "Smart Contract Confirmed", time: "10:31 AM", active: true, icon: ShieldCheck },
                            { title: "Funds Converted (HKD → PHP)", time: "10:31 AM", active: true, icon: ArrowRight },
                            { title: "Sent to Recipient", time: "10:32 AM", active: true, icon: CheckCircle2 },
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative flex items-center gap-4 z-10"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.active ? 'bg-primary border-primary text-white' : 'bg-secondary border-muted text-muted-foreground'}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-medium ${step.active ? 'text-white' : 'text-muted-foreground'}`}>{step.title}</div>
                                    <div className="text-xs text-muted-foreground">{step.time}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium underline-offset-4 hover:underline">
                            View on Etherlink Explorer
                        </a>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center text-muted-foreground py-20">
                    Enter a transaction reference to see details
                </div>
            )}
        </div>
    );
}
