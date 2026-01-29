"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitGuess } from "@/server/actions/vote";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

interface GuessInputProps {
  roomCode: string;
  roundId: string;
  onSuccess: (correct: boolean) => void;
}

export function GuessInput({ roomCode, roundId, onSuccess }: GuessInputProps) {
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guess.trim()) {
      toast.error("Escribe la palabra");
      return;
    }
    setLoading(true);
    const result = await submitGuess(roomCode, roundId, guess);
    setLoading(false);
    if (result.ok && "correct" in result) {
      if (result.correct) {
        toast.success("¡Correcto!");
      } else {
        toast.error("Incorrecto. La partida termina.");
      }
      onSuccess(result.correct);
    } else if (!result.ok) {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-center text-sm text-muted-foreground">
        Eres el impostor. Intenta adivinar la palabra:
      </p>
      <div className="flex gap-2">
        <Input
          placeholder="Tu respuesta"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={loading}
          className="flex-1"
          autoFocus
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2Icon className="size-4 animate-spin" /> : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
