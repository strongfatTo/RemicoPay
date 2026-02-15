import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <section
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto md:auto-rows-[20rem]",
        className
      )}
      aria-label="Key Features"
    >
      {children}
    </section>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <article
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-300 shadow-input dark:shadow-none p-6 bg-brand-navy border border-white/10 flex flex-col justify-between hover:border-brand-mint/30 relative overflow-hidden",
        className
      )}
    >
      {header && (
        <div className="flex-1 w-full rounded-xl overflow-hidden relative z-10">
          {header}
        </div>
      )}
      
      <div className="group-hover/bento:translate-x-1 transition duration-300 mt-4 z-10">
        <div className="mb-3 w-fit p-2 rounded-lg bg-brand-deep/50 border border-white/5 group-hover/bento:border-brand-mint/20 transition-colors">
            {icon}
        </div>
        <h3 className="font-sans font-bold text-white text-lg mb-2 tracking-tight">
          {title}
        </h3>
        <p className="font-sans font-normal text-white/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-brand-mint/5 opacity-0 group-hover/bento:opacity-100 transition duration-500 pointer-events-none" />
    </article>
  );
};
