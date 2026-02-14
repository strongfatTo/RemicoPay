import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ShieldCheck, Zap, Globe, Headset, ArrowUpRight } from "lucide-react";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-brand-navy/50 to-brand-deep/50 border border-white/5"></div>
);

export function Features() {
  const items = [
    {
      title: "Best Exchange Rates",
      description: "Real-time mid-market rates with no hidden fees.",
      header: <Skeleton />,
      icon: <Zap className="h-4 w-4 text-brand-mint" />,
    },
    {
      title: "Instant Confirmation",
      description: "Get your funds delivered in minutes, not days.",
      header: <Skeleton />,
      icon: <ArrowUpRight className="h-4 w-4 text-brand-mint" />,
    },
    {
      title: "Licensed & Secure",
      description: "Regulated by top financial authorities worldwide.",
      header: <Skeleton />,
      icon: <ShieldCheck className="h-4 w-4 text-brand-mint" />,
    },
    {
      title: "24/7 Global Support",
      description: "Our team is here to help you anytime, anywhere.",
      header: <Skeleton />,
      icon: <Headset className="h-4 w-4 text-brand-mint" />,
    },
  ];

  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
