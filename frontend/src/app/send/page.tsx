"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Wallet } from "lucide-react";

export default function SendPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

    // Form State
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const nextStep = () => {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="container mx-auto px-4 max-w-lg pt-10">
            {/* Stepper Header */}
            <div className="flex justify-between items-center mb-8 relative">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center z-10">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500
               ${currentStep >= step ? 'bg-primary text-white shadow-lg shadow-indigo-500/30 ring-2 ring-primary/30' : 'bg-secondary text-muted-foreground border border-white/10'}`}
                        >
                            {currentStep > step ? <Check className="w-5 h-5" /> : step}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${currentStep >= step ? 'text-primary' : 'text-muted-foreground'}`}>
                            {step === 1 ? 'Amount' : step === 2 ? 'Recipient' : 'Confirm'}
                        </span>
                    </div>
                ))}
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-secondary rounded-full -z-10" />
                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-5 left-0 h-1 bg-primary rounded-full -z-10"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Form Card */}
            <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col justify-between"
                    >
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold font-heading">Enter Amount</h2>
                                <div className="relative">
                                    <label className="text-sm text-muted-foreground mb-2 block">You Send (HKD)</label>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-secondary/50 border border-white/10 rounded-2xl px-4 py-4 text-3xl font-bold outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Exchange Rate</span>
                                    <span className="font-mono text-green-400">1 HKD ≈ 7.25 PHP</span>
                                </div>
                                <Button size="lg" className="w-full mt-8" onClick={nextStep} disabled={!amount}>
                                    Continue
                                </Button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold font-heading">Recipient Details</h2>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Wallet Address (0x...)</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                        <input
                                            type="text"
                                            autoFocus
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            className="w-full bg-secondary/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 font-mono outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            placeholder="0x123..."
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <Button variant="ghost" onClick={prevStep} className="flex-1">Back</Button>
                                    <Button className="flex-[2]" onClick={nextStep} disabled={!recipient}>Review</Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold font-heading">Review Transfer</h2>

                                <div className="space-y-4 bg-secondary/30 p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Send Amount</span>
                                        <span className="font-bold">{amount} HKD</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Recipient Gets</span>
                                        <span className="font-bold text-green-400">≈ {(Number(amount) * 7.25).toFixed(2)} PHP</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fee (0.7%)</span>
                                        <span className="text-amber-400">{(Number(amount) * 0.007).toFixed(2)} HKD</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">To</span>
                                        <span className="font-mono text-xs max-w-[150px] truncate">{recipient}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button variant="ghost" onClick={prevStep} className="flex-1">Edit</Button>
                                    <Button variant="gold" className="flex-[2] py-6 shadow-lg shadow-amber-500/20" onClick={() => alert('Add Contract Integration Here')}>
                                        Confirm & Send
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
