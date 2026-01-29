"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { voteSchema, guessWordSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function castVote(
  roomCode: string,
  targetPlayerId: string,
  roundId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const parsed = voteSchema.safeParse({ targetPlayerId, roundId });
  if (!parsed.success) {
    return { ok: false, error: "Datos de voto inválidos" };
  }

  const round = await prisma.gameRound.findUnique({
    where: { id: roundId },
    include: {
      room: { include: { players: { include: { user: true } } } },
      votes: true,
    },
  });

  if (!round || round.room.code !== roomCode) {
    return { ok: false, error: "Ronda no encontrada" };
  }

  const player = round.room.players.find((p) => p.userId === session.user.id);
  if (!player) {
    return { ok: false, error: "No estás en esta sala" };
  }

  const targetInRoom = round.room.players.some(
    (p) => p.id === parsed.data.targetPlayerId
  );
  if (!targetInRoom) {
    return { ok: false, error: "Jugador no válido" };
  }

  const alreadyVoted = round.votes.some((v) => v.casterId === player.id);
  if (alreadyVoted) {
    return { ok: false, error: "Ya votaste" };
  }

  await prisma.vote.create({
    data: {
      roundId: round.id,
      casterId: player.id,
      targetId: parsed.data.targetPlayerId,
    },
  });

  revalidatePath(`/room/${roomCode}`);
  return { ok: true };
}

export async function submitGuess(
  roomCode: string,
  roundId: string,
  guess: string
): Promise<{ ok: true; correct: boolean } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const parsed = guessWordSchema.safeParse({ roundId, guess: guess.trim() });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  const round = await prisma.gameRound.findUnique({
    where: { id: roundId },
    include: {
      room: { include: { players: true } },
      word: true,
    },
  });

  if (!round || round.room.code !== roomCode) {
    return { ok: false, error: "Ronda no encontrada" };
  }

  const player = round.room.players.find((p) => p.userId === session.user.id);
  if (!player || player.role !== "IMPOSTOR") {
    return { ok: false, error: "No eres el impostor" };
  }

  const correct =
    guess.trim().toLowerCase() === round.word.text.toLowerCase();

  // Save the guess result
  await prisma.gameRound.update({
    where: { id: round.id },
    data: {
      impostorGuess: guess.trim(),
      impostorGuessedCorrect: correct,
    },
  });

  if (correct) {
    // Impostor wins - gets a point
    await prisma.player.update({
      where: { id: player.id },
      data: { score: { increment: 1 } },
    });
  } else {
    // Civilians win - they all get a point
    await prisma.player.updateMany({
      where: {
        roomId: round.roomId,
        role: "CIVILIAN",
      },
      data: { score: { increment: 1 } },
    });
  }

  await prisma.room.update({
    where: { id: round.roomId },
    data: { status: "FINISHED" },
  });

  revalidatePath(`/room/${roomCode}`);
  return { ok: true, correct };
}
