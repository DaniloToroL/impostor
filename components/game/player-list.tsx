"use client";

import { PlayerCard } from "./player-card";

type Player = {
  id: string;
  turnOrder: number | null;
  user: { id: string; name: string | null; image: string | null };
};

interface PlayerListProps {
  players: Player[];
  hostId: string;
  currentTurnIndex: number | null;
  voteCountByPlayerId?: Record<string, number>;
  currentUserId?: string;
}

export function PlayerList({
  players,
  hostId,
  currentTurnIndex,
  voteCountByPlayerId = {},
  currentUserId,
}: PlayerListProps) {
  const ordered =
    players.length > 0 && players.every((p) => p.turnOrder != null)
      ? [...players].sort((a, b) => (a.turnOrder ?? 0) - (b.turnOrder ?? 0))
      : players;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {ordered.map((player) => (
        <PlayerCard
          key={player.id}
          name={player.user.name}
          image={player.user.image}
          isHost={player.user.id === hostId}
          isCurrentTurn={
            currentTurnIndex != null &&
            (player.turnOrder ?? -1) === currentTurnIndex
          }
          voteCount={voteCountByPlayerId[player.id]}
        />
      ))}
    </div>
  );
}
