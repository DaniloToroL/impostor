"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WordRevealProps {
  word: string | null;
  isImpostor: boolean;
  categoryName: string;
  className?: string;
}

export function WordReveal({
  word,
  isImpostor,
  categoryName,
  className,
}: WordRevealProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isImpostor && "border-destructive bg-destructive/5",
        className
      )}
    >
      <CardHeader className="pb-2">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Categoría: {categoryName}
        </p>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-center text-2xl font-bold tracking-tight sm:text-3xl",
            isImpostor && "text-destructive"
          )}
        >
          {isImpostor ? "ERES EL IMPOSTOR" : word ?? "—"}
        </p>
      </CardContent>
    </Card>
  );
}
