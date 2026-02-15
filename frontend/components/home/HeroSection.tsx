"use client";

import { motion } from "framer-motion";
import { Shield, Zap, TrendingDown } from "lucide-react";
import { HeroBeam } from "@/components/home/HeroBeam";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HeroSection() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-16"
    >
      {/* Badge */}
      <motion.div variants={itemVariants} className="mb-6 inline-block">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-mint/30 bg-brand-mint/10 px-4 py-1.5 text-sm text-brand-mint">
          <span className="h-2 w-2 rounded-full bg-brand-mint animate-pulse" />
          Live on Etherlink Testnet
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        variants={itemVariants}
        className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
      >
        <span className="text-white">Remico</span>
        <span className="text-neon-mint">Pay</span>
        <br />
        <span className="text-gradient text-3xl sm:text-4xl lg:text-5xl font-semibold">
          HKD → PHP in Seconds
        </span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        variants={itemVariants}
        className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-8"
      >
        Fast. Secure. Stablecoin Remittance.
        <br />
        Send money from Hong Kong to the Philippines with the lowest fees
        and instant settlement on Etherlink.
      </motion.p>

      {/* Beam Animation */}
      <motion.div variants={itemVariants} className="mb-12">
        <HeroBeam />
      </motion.div>
    </motion.div>
  );
}
