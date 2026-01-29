"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRoom } from "@/server/actions/room";
import { startGame, nextTurn } from "@/server/actions/game";
import { leaveRoom } from "@/server/actions/room";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlayerList } from "@/components/game/player-list";
import { WordReveal } from "@/components/game/word-reveal";
import { TurnIndicator } from "@/components/game/turn-indicator";
import { VotingModal } from "@/components/game/voting-modal";
import { GuessInput } from "@/components/game/guess-input";
import { Timer } from "@/components/game/timer";
import { GameResults } from "@/components/game/game-results";
import { toast } from "sonner";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useState } from "react";

const POLL_INTERVAL = 2000;
const TURN_DURATION_SECONDS = 60;

interface RoomClientProps {
  code: string;
  currentUserId: string | null;
}

export function RoomClient({ code, currentUserId }: RoomClientProps) {
  const [votingOpen, setVotingOpen] = useState(false);
  const [showGuess, setShowGuess] = useState(false);

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", code],
    queryFn: () => fetchRoom(code),
    refetchInterval: POLL_INTERVAL,
  });

  if (isLoading || !room) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentRound = room.rounds[0];
  const players = room.players;
  const hostId = room.hostId;
  const currentTurnIndex = room.currentTurnIndex ?? 0;
  const currentSpeaker = players[currentTurnIndex]?.user.name ?? null;
  const voteCountByPlayerId: Record<string, number> = {};
  if (currentRound?.votes) {
    for (const v of currentRound.votes) {
      voteCountByPlayerId[v.targetId] =
        (voteCountByPlayerId[v.targetId] ?? 0) + 1;
    }
  }

  const myPlayer = currentUserId
    ? players.find((p) => p.user.id === currentUserId)
    : null;
  const isImpostor = myPlayer?.role === "IMPOSTOR";

  const allVoted = currentRound && currentRound.votes.length >= players.length;
  
  const isVotingPhase =
    room.status === "PLAYING" &&
    currentRound &&
    currentTurnIndex >= players.length &&
    !allVoted;
    
  const isGuessPhase =
    room.status === "PLAYING" && currentRound && allVoted && showGuess;

  async function handleStart() {
    const result = await startGame(code);
    if (result.ok) toast.success("¡Partida iniciada!");
    else toast.error(result.error);
  }

  async function handleNextTurn() {
    const result = await nextTurn(code);
    if (result.ok) toast.success("Siguiente turno");
    else toast.error(result.error);
  }

  async function handleLeave() {
    const result = await leaveRoom(code);
    if (result.ok) {
      toast.success("Saliste de la sala");
      window.location.href = "/";
    } else toast.error(result.error);
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold">Sala {room.code}</h1>
          <Button variant="ghost" size="icon" onClick={handleLeave}>
            <LogOutIcon className="size-5" />
            <span className="sr-only">Salir</span>
          </Button>
        </div>

        {room.status === "WAITING" && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Esperando jugadores</h2>
              <p className="text-muted-foreground text-sm">
                Código:{" "}
                <span className="font-mono font-bold">{room.code}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PlayerList
                players={players}
                hostId={hostId}
                currentTurnIndex={null}
              />
              <div className="flex gap-2">
                {room.hostId === currentUserId && (
                  <Button
                    onClick={handleStart}
                    disabled={players.length < 3}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    Iniciar partida (mín. 3)
                  </Button>
                )}
                <Button variant="outline" onClick={handleLeave}>
                  Salir
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {room.status === "PLAYING" && currentRound && (
          <>
            <TurnIndicator
              currentSpeakerName={currentSpeaker}
              phase={
                isGuessPhase
                  ? "guess"
                  : isVotingPhase
                    ? "voting"
                    : allVoted
                      ? "guess"
                      : currentTurnIndex >= players.length
                        ? "voting"
                        : "turns"
              }
            />

            <WordReveal
              word={currentRound.word?.text ?? null}
              isImpostor={isImpostor}
              categoryName={currentRound.word?.category?.name ?? "—"}
            />

            <PlayerList
              players={players}
              hostId={hostId}
              currentTurnIndex={currentTurnIndex}
              voteCountByPlayerId={voteCountByPlayerId}
            />

            {currentTurnIndex < players.length && (
              <Card>
                <CardContent className="pt-6">
                  <Timer
                    durationSeconds={TURN_DURATION_SECONDS}
                    onComplete={handleNextTurn}
                  />
                  <Button
                    className="mt-4 w-full"
                    variant="secondary"
                    onClick={handleNextTurn}
                  >
                    Siguiente turno
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Voting phase */}
            {isVotingPhase && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => setVotingOpen(true)}
              >
                Votar quién es el impostor
              </Button>
            )}

            {/* After voting - impostor guesses */}
            {allVoted && !showGuess && isImpostor && (
              <Button
                size="lg"
                variant="destructive"
                className="w-full"
                onClick={() => setShowGuess(true)}
              >
                Última oportunidad: adivina la palabra
              </Button>
            )}

            {allVoted && !showGuess && !isImpostor && (
              <p className="text-center text-muted-foreground text-sm">
                Esperando a que el impostor intente adivinar la palabra…
              </p>
            )}

            {showGuess && isImpostor && (
              <Card>
                <CardContent className="pt-6">
                  <GuessInput
                    roomCode={code}
                    roundId={currentRound.id}
                    onSuccess={() => setShowGuess(false)}
                  />
                </CardContent>
              </Card>
            )}

            <VotingModal
              open={votingOpen}
              onOpenChange={setVotingOpen}
              players={players}
              roundId={currentRound.id}
              roomCode={code}
              currentUserId={currentUserId ?? ""}
            />
          </>
        )}

        {room.status === "FINISHED" && (
          <div className="space-y-6">
            <GameResults
              players={players}
              currentRound={currentRound}
              hostId={hostId}
            />
            <Button asChild className="w-full" size="lg">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
