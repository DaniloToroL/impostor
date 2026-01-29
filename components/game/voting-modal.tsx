"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { castVote } from "@/server/actions/vote";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

type Player = {
  id: string;
  user: { id: string; name: string | null; image: string | null };
};

interface VotingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  roundId: string;
  roomCode: string;
  currentUserId: string;
  tiebreakPlayerIds?: string[]; // If set, only allow voting for these players
}

export function VotingModal({
  open,
  onOpenChange,
  players,
  roundId,
  roomCode,
  currentUserId,
  tiebreakPlayerIds,
}: VotingModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isTiebreakVote = tiebreakPlayerIds && tiebreakPlayerIds.length > 0;
  
  // In tiebreak, show only tied players (excluding self). Otherwise show all others.
  const others = isTiebreakVote
    ? players.filter((p) => tiebreakPlayerIds.includes(p.id) && p.user.id !== currentUserId)
    : players.filter((p) => p.user.id !== currentUserId);

  async function handleVote() {
    if (!selectedId) {
      toast.error("Elige a un jugador");
      return;
    }
    setLoading(true);
    const result = await castVote(roomCode, selectedId, roundId);
    setLoading(false);
    if (result.ok) {
      toast.success("Voto registrado");
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {isTiebreakVote ? "Segunda votación - Desempate" : "¿Quién es el impostor?"}
          </DialogTitle>
          {isTiebreakVote && (
            <p className="text-sm text-muted-foreground">
              Solo puedes votar entre los jugadores empatados
            </p>
          )}
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {others.map((player) => (
            <Button
              key={player.id}
              variant={selectedId === player.id ? "default" : "outline"}
              size="lg"
              className="h-auto justify-start gap-3 py-3"
              onClick={() => setSelectedId(player.id)}
            >
              <Avatar className="size-8">
                <AvatarImage src={player.user.image ?? undefined} />
                <AvatarFallback>
                  {player.user.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{player.user.name ?? "Jugador"}</span>
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleVote}
            disabled={!selectedId || loading}
            className="flex-1"
          >
            {loading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "Enviar voto"
            )}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
