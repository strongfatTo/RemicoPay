"use client";

import React, { useRef } from "react";
import { Wallet, FileCode2, User } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const Circle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/10 bg-brand-navy p-3 shadow-[0_0_20px_-12px_rgba(255,255,255,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function HeroBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden p-8 mx-auto my-8"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center gap-2 z-20">
           <Circle ref={div1Ref}>
              <Wallet className="h-5 w-5 text-white" />
           </Circle>
           <span className="text-xs font-medium text-white/70">You (HKD)</span>
        </div>

        <div className="flex flex-col items-center gap-2 z-20">
          <Circle ref={div2Ref} className="h-16 w-16 border-brand-mint/50 bg-brand-deep shadow-[0_0_30px_-5px_rgba(45,212,191,0.3)]">
             <FileCode2 className="h-7 w-7 text-brand-mint" />
          </Circle>
          <span className="text-xs font-bold text-brand-mint">Smart Contract</span>
        </div>

        <div className="flex flex-col items-center gap-2 z-20">
          <Circle ref={div3Ref}>
             <User className="h-5 w-5 text-white" />
          </Circle>
          <span className="text-xs font-medium text-white/70">Recipient (PHP)</span>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        curvature={20}
        pathColor="rgba(255, 255, 255, 0.1)"
        gradientStartColor="#2dd4bf"
        gradientStopColor="#5eead4"
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
        curvature={-20}
        pathColor="rgba(255, 255, 255, 0.1)"
        gradientStartColor="#2dd4bf"
        gradientStopColor="#5eead4"
        duration={3}
        delay={1.5}
      />
    </div>
  );
}
