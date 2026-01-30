"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Skull, Trophy, CheckCircle, XCircle } from "lucide-react";

type Player = {
  id: string;
  role: string;
  score: number;
  user: { id: string; name: string | null; image: string | null };
};

type Round = {
  word: { text: string; category: { name: string } | null } | null;
  impostorGuess: string | null;
  impostorGuessedCorrect: boolean | null;
};

interface GameResultsProps {
  players: Player[];
  currentRound: Round | null;
  hostId: string;
}

export function GameResults({ players, currentRound, hostId }: GameResultsProps) {
  const impostor = players.find((p) => p.role === "IMPOSTOR");
  const word = currentRound?.word?.text ?? "???";
  const category = currentRound?.word?.category?.name ?? "???";
  const impostorGuessed = currentRound?.impostorGuessedCorrect;
  const impostorGuessText = currentRound?.impostorGuess;

  // Sort players by score (descending)
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);

  const impostorWon = impostorGuessed === true;

  return (
    <div className="space-y-6">
      {/* Result announcement */}
      <Card className={impostorWon ? "border-red-500/50 bg-red-500/10" : "border-green-500/50 bg-green-500/10"}>
        <CardHeader className="pb-2">
          <h2 className="text-center text-2xl font-bold">
            {impostorWon ? "¡El impostor ganó!" : "¡Los civiles ganaron!"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Impostor reveal */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Skull className="size-5" />
              <span>El impostor era:</span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border-2 border-red-500">
                <AvatarImage src={impostor?.user.image ?? undefined} />
                <AvatarFallback className="bg-red-500/20 text-red-600">
                  {impostor?.user.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xl font-bold">{impostor?.user.name ?? "???"}</span>
            </div>
          </div>

          {/* Word reveal */}
          <div className="rounded-lg bg-background/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">La palabra era:</p>
            <p className="text-2xl font-bold">{word}</p>
            <p className="text-sm text-muted-foreground">Categoría: {category}</p>
          </div>

          {/* Impostor's guess */}
          {impostorGuessText && (
            <div className="flex items-center justify-center gap-2 text-sm">
              {impostorGuessed ? (
                <>
                  <CheckCircle className="size-5 text-green-500" />
                  <span>El impostor adivinó correctamente: <strong>{impostorGuessText}</strong></span>
                </>
              ) : (
                <>
                  <XCircle className="size-5 text-red-500" />
                  <span>El impostor falló con: <strong>{impostorGuessText}</strong></span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Trophy className="size-5 text-yellow-500" />
            Ranking de la sala
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rankedPlayers.map((player, index) => {
              const isImpostor = player.role === "IMPOSTOR";
              const isHost = player.user.id === hostId;
              const position = index + 1;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    position === 1
                      ? "bg-yellow-500/10 border border-yellow-500/30"
                      : position === 2
                        ? "bg-gray-300/10 border border-gray-300/30"
                        : position === 3
                          ? "bg-orange-600/10 border border-orange-600/30"
                          : "bg-muted/50"
                  }`}
                >
                  {/* Position */}
                  <div className={`flex size-8 items-center justify-center rounded-full font-bold ${
                    position === 1
                      ? "bg-yellow-500 text-yellow-950"
                      : position === 2
                        ? "bg-gray-300 text-gray-800"
                        : position === 3
                          ? "bg-orange-600 text-white"
                          : "bg-muted text-muted-foreground"
                  }`}>
                    {position}
                  </div>

                  {/* Avatar */}
                  <Avatar className="size-10">
                    <AvatarImage src={player.user.image ?? undefined} />
                    <AvatarFallback>
                      {player.user.name?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name and badges */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.user.name ?? "Jugador"}</span>
                      {isHost && (
                        <span title="Anfitrión" className="inline-flex">
                          <Crown className="size-4 text-yellow-500" aria-hidden />
                        </span>
                      )}
                      {isImpostor && (
                        <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs font-medium text-red-600">
                          Impostor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className="text-lg font-bold">{player.score}</span>
                    <span className="ml-1 text-sm text-muted-foreground">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
