"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const rates = [
  { pair: "HKD/PHP", ourRate: 7.35, bankRate: 7.15, save: "2.8%" },
  { pair: "USD/PHP", ourRate: 56.50, bankRate: 55.80, save: "1.2%" },
  { pair: "SGD/PHP", ourRate: 42.10, bankRate: 41.50, save: "1.4%" },
  { pair: "GBP/PHP", ourRate: 71.20, bankRate: 70.10, save: "1.5%" },
];

export function RatesTable() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Live Exchange Rates</h2>
        <button className="flex items-center gap-2 text-sm font-medium text-brand-mint hover:text-brand-mint-light transition-colors">
          View all rates <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-brand-navy/50 shadow-sm backdrop-blur-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-deep/50 text-white/60">
            <tr>
              <th className="px-6 py-4 font-medium">Currency Pair</th>
              <th className="px-6 py-4 font-medium">Our Rate</th>
              <th className="px-6 py-4 font-medium">Bank Rate</th>
              <th className="px-6 py-4 font-medium text-right">You Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rates.map((rate, index) => (
              <motion.tr
                key={rate.pair}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-mint/10 flex items-center justify-center text-xs font-bold text-brand-mint">
                    {rate.pair.split("/")[0]}
                  </div>
                  {rate.pair}
                </td>
                <td className="px-6 py-4 text-brand-mint font-bold">{rate.ourRate}</td>
                <td className="px-6 py-4 text-white/40 line-through">{rate.bankRate}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-mint/10 text-brand-mint">
                    {rate.save}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
