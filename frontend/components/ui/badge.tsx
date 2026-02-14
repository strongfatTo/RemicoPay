import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-mint/20 text-brand-mint border border-brand-mint/30",
        pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        processing: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        completed: "bg-green-500/20 text-green-400 border border-green-500/30",
        cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
        outline: "border border-white/20 text-white/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
