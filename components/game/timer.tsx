"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TimerProps {
  durationSeconds: number;
  onComplete?: () => void;
  className?: string;
}

export function Timer({
  durationSeconds,
  onComplete,
  className,
}: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [durationSeconds, onComplete]);

  const progress = (remaining / durationSeconds) * 100;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="text-center text-2xl font-mono tabular-nums">
        {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
