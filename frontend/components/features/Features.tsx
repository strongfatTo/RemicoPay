import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ShieldCheck, Zap, Headset, ArrowUpRight } from "lucide-react";

export function Features() {
  const items = [
    {
      title: "Best Exchange Rates",
      description: "Real-time mid-market rates with no hidden fees. Save up to 3x compared to banks.",
      icon: <Zap className="h-5 w-5 text-brand-mint" />,
    },
    {
      title: "Instant Confirmation",
      description: "Get your funds delivered in minutes, not days.",
      icon: <ArrowUpRight className="h-5 w-5 text-brand-mint" />,
    },
    {
      title: "Licensed & Secure",
      description: "Regulated by top financial authorities worldwide.",
      icon: <ShieldCheck className="h-5 w-5 text-brand-mint" />,
    },
    {
      title: "24/7 Global Support",
      description: "Our dedicated support team is available around the clock to assist you in multiple languages.",
      icon: <Headset className="h-5 w-5 text-brand-mint" />,
    },
  ];

  return (
    <BentoGrid className="max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-4 md:auto-rows-[16rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          icon={item.icon}
          className=""
        />
      ))}
    </BentoGrid>
  );
}
