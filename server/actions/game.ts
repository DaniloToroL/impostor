"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shuffle } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const MIN_PLAYERS = 3;

// Helper to detect tie in votes
function findTiedPlayers(votes: { targetId: string }[]): string[] {
  const voteCounts: Record<string, number> = {};
  for (const vote of votes) {
    voteCounts[vote.targetId] = (voteCounts[vote.targetId] ?? 0) + 1;
  }
  
  const maxVotes = Math.max(...Object.values(voteCounts));
  const tiedPlayers = Object.entries(voteCounts)
    .filter(([, count]) => count === maxVotes)
    .map(([playerId]) => playerId);
  
  return tiedPlayers.length > 1 ? tiedPlayers : [];
}

export async function startGame(
  roomCode: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: {
      players: { include: { user: true } },
      host: true,
    },
  });

  if (!room) {
    return { ok: false, error: "Sala no encontrada" };
  }
  if (room.status !== "WAITING") {
    return { ok: false, error: "La partida ya empezó" };
  }
  if (room.hostId !== session.user.id) {
    return { ok: false, error: "Solo el anfitrión puede iniciar" };
  }
  if (room.players.length < MIN_PLAYERS) {
    return {
      ok: false,
      error: `Se necesitan al menos ${MIN_PLAYERS} jugadores`,
    };
  }

  const categories = await prisma.category.findMany({
    include: { words: { take: 50 } },
  });
  const withWords = categories.filter((c) => c.words.length > 0);
  if (withWords.length === 0) {
    return { ok: false, error: "No hay categorías con palabras. Ejecuta el seed." };
  }

  const category = withWords[Math.floor(Math.random() * withWords.length)];
  const words = category.words;
  const word = words[Math.floor(Math.random() * words.length)];

  const playerIds = room.players.map((p) => p.id);
  const impostorIndex = Math.floor(Math.random() * playerIds.length);
  const shuffledOrder = shuffle(playerIds);

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < shuffledOrder.length; i++) {
      const role = i === impostorIndex ? "IMPOSTOR" : "CIVILIAN";
      await tx.player.update({
        where: { id: shuffledOrder[i] },
        data: { role, turnOrder: i },
      });
    }

    await tx.gameRound.create({
      data: {
        roomId: room.id,
        wordId: word.id,
        roundNum: 1,
      },
    });

    await tx.room.update({
      where: { id: room.id },
      data: { status: "PLAYING", currentTurnIndex: 0 },
    });
  });

  revalidatePath(`/room/${roomCode}`);
  return { ok: true };
}

export async function nextTurn(
  roomCode: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: { players: true },
  });

  if (!room || room.status !== "PLAYING") {
    return { ok: false, error: "Sala no válida" };
  }

  const current = room.currentTurnIndex ?? 0;
  const nextIndex = current + 1;

  // Actualizar el índice de turno (incluso si pasa a fase de votación)
  await prisma.room.update({
    where: { id: room.id },
    data: { currentTurnIndex: nextIndex },
  });

  revalidatePath(`/room/${roomCode}`);
  return { ok: true };
}

// Check votes and start tiebreak if needed
export async function checkForTiebreak(
  roomCode: string
): Promise<{ ok: true; tiebreak: boolean; tiedPlayerIds?: string[] } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: {
      players: true,
      rounds: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { votes: true },
      },
    },
  });

  if (!room || room.status !== "PLAYING") {
    return { ok: false, error: "Sala no válida" };
  }

  const currentRound = room.rounds[0];
  if (!currentRound) {
    return { ok: false, error: "No hay ronda activa" };
  }

  // Check if all players have voted
  if (currentRound.votes.length < room.players.length) {
    return { ok: false, error: "No todos han votado" };
  }

  // Already in tiebreak?
  if (room.tiebreakPlayerIds.length > 0) {
    return { ok: true, tiebreak: true, tiedPlayerIds: room.tiebreakPlayerIds };
  }

  const tiedPlayers = findTiedPlayers(currentRound.votes);
  
  if (tiedPlayers.length > 1) {
    // Check if we're already in tiebreak - if so, restart defense phase
    if (room.tiebreakPlayerIds.length > 0) {
      // Delete old votes and restart defense
      await prisma.vote.deleteMany({
        where: { roundId: currentRound.id },
      });
      
      await prisma.room.update({
        where: { id: room.id },
        data: {
          tiebreakPlayerIds: tiedPlayers,
          tiebreakDefenseIdx: 0,
          tiebreakStartedAt: new Date(),
        },
      });
    } else {
      // Start tiebreak phase for first time
      await prisma.room.update({
        where: { id: room.id },
        data: {
          tiebreakPlayerIds: tiedPlayers,
          tiebreakDefenseIdx: 0,
          tiebreakStartedAt: new Date(),
        },
      });
    }
    
    revalidatePath(`/room/${roomCode}`);
    return { ok: true, tiebreak: true, tiedPlayerIds: tiedPlayers };
  }

  // No tie - clear tiebreak state if it was active
  if (room.tiebreakPlayerIds.length > 0) {
    await prisma.room.update({
      where: { id: room.id },
      data: {
        tiebreakPlayerIds: [],
        tiebreakDefenseIdx: null,
        tiebreakStartedAt: null,
      },
    });
    revalidatePath(`/room/${roomCode}`);
  }

  return { ok: true, tiebreak: false };
}

// Advance to next defender in tiebreak
export async function nextTiebreakDefense(
  roomCode: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: {
      rounds: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { votes: true },
      },
    },
  });

  if (!room || room.status !== "PLAYING") {
    return { ok: false, error: "Sala no válida" };
  }

  if (room.tiebreakPlayerIds.length === 0) {
    return { ok: false, error: "No hay desempate activo" };
  }

  const currentIdx = room.tiebreakDefenseIdx ?? 0;
  const nextIdx = currentIdx + 1;

  if (nextIdx >= room.tiebreakPlayerIds.length) {
    // All defenders done, delete old votes and start revote
    const currentRound = room.rounds[0];
    if (currentRound) {
      await prisma.vote.deleteMany({
        where: { roundId: currentRound.id },
      });
    }

    await prisma.room.update({
      where: { id: room.id },
      data: {
        tiebreakDefenseIdx: room.tiebreakPlayerIds.length, // Mark defense as complete
        tiebreakStartedAt: null,
      },
    });
  } else {
    await prisma.room.update({
      where: { id: room.id },
      data: {
        tiebreakDefenseIdx: nextIdx,
        tiebreakStartedAt: new Date(),
      },
    });
  }

  revalidatePath(`/room/${roomCode}`);
  return { ok: true };
}

// Clear tiebreak state (call after tiebreak vote resolves without tie)
export async function clearTiebreak(
  roomCode: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  await prisma.room.update({
    where: { code: roomCode },
    data: {
      tiebreakPlayerIds: [],
      tiebreakDefenseIdx: null,
      tiebreakStartedAt: null,
    },
  });

  revalidatePath(`/room/${roomCode}`);
  return { ok: true };
}
