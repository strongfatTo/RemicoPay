"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data
const MOCK_HISTORY = [
    { id: 1, type: "send", amount: "5,000", curr: "HKD", to: "0x123...abc", date: "Today, 10:30 AM", status: "Completed" },
    { id: 2, type: "send", amount: "1,200", curr: "HKD", to: "0x456...def", date: "Yesterday", status: "Completed" },
    { id: 3, type: "receive", amount: "500", curr: "HKD", from: "Faucet", date: "Feb 10, 2026", status: "Completed" },
];

export default function HistoryPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4 max-w-2xl pt-10">
            <h1 className="text-3xl font-bold font-heading mb-8">Transaction History</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {MOCK_HISTORY.map((tx) => (
                        <motion.div
                            key={tx.id}
                            variants={item}
                            className="glass-card hover:glass-card-hover p-4 rounded-2xl flex items-center justify-between cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'send' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {tx.type === 'send' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="font-medium text-white">
                                        {tx.type === 'send' ? 'Sent to ' + tx.to : 'Received from ' + tx.from}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{tx.date}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold font-mono ${tx.type === 'send' ? 'text-white' : 'text-green-400'}`}>
                                    {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.curr}
                                </div>
                                <div className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                    {tx.status}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {MOCK_HISTORY.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No transactions found.
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
