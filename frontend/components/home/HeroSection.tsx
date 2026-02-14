"use client";

import { motion } from "framer-motion";
import { Shield, Zap, TrendingDown } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Settlement",
    description: "Transactions confirmed in seconds on Etherlink",
  },
  {
    icon: TrendingDown,
    title: "0.7% Fee Only",
    description: "Fraction of traditional remittance costs",
  },
  {
    icon: Shield,
    title: "Fully On-Chain",
    description: "Transparent and verifiable on the blockchain",
  },
];

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
        className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12"
      >
        Fast. Secure. Stablecoin Remittance.
        <br />
        Send money from Hong Kong to the Philippines with the lowest fees
        and instant settlement on Etherlink.
      </motion.p>

      {/* Feature cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
      >
        {features.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card-hover p-5 text-center"
          >
            <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-brand-mint/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-brand-mint" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
            <p className="text-xs text-white/50">{description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
