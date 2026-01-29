"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  name: string | null;
  image: string | null;
  isHost?: boolean;
  isCurrentTurn?: boolean;
  voteCount?: number;
  className?: string;
}

export function PlayerCard({
  name,
  image,
  isHost,
  isCurrentTurn,
  voteCount = 0,
  className,
}: PlayerCardProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
        isCurrentTurn && "border-primary bg-primary/5 ring-2 ring-primary/30",
        className
      )}
    >
      <Avatar className="size-14">
        <AvatarImage src={image ?? undefined} alt={name ?? ""} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <p className="truncate text-center text-sm font-medium max-w-full">
        {name ?? "Jugador"}
      </p>
      <div className="flex flex-wrap justify-center gap-1">
        {isHost && (
          <Badge variant="secondary" className="text-xs">
            Anfitrión
          </Badge>
        )}
        {isCurrentTurn && (
          <Badge>Hablando</Badge>
        )}
        {voteCount > 0 && (
          <Badge variant="outline">{voteCount} voto{voteCount !== 1 ? "s" : ""}</Badge>
        )}
      </div>
    </div>
  );
}
