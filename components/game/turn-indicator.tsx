"use client";

import { cn } from "@/lib/utils";

interface TurnIndicatorProps {
  currentSpeakerName: string | null;
  phase: "word" | "turns" | "voting" | "guess" | "finished" | "tiebreak" | "tiebreak-vote";
  className?: string;
}

export function TurnIndicator({
  currentSpeakerName,
  phase,
  className,
}: TurnIndicatorProps) {
  const labels: Record<typeof phase, string> = {
    word: "Revisa tu palabra",
    turns: currentSpeakerName
      ? `Hablando: ${currentSpeakerName}`
      : "Ronda de palabras",
    voting: "Votación: elige al impostor",
    guess: "Última oportunidad: el impostor debe adivinar",
    finished: "Partida terminada",
    tiebreak: "¡Empate! Fase de defensa",
    "tiebreak-vote": "Segunda votación - Desempate",
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/50 px-4 py-2 text-center text-sm font-medium",
        className
      )}
    >
      {labels[phase]}
    </div>
  );
}
