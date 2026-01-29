"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  generateRoomCode,
  joinRoomSchema,
  type JoinRoomInput,
} from "@/lib/validations";
import { getRoomWithCurrentRound } from "@/server/queries/room";
import { revalidatePath } from "next/cache";

export async function fetchRoom(code: string) {
  return getRoomWithCurrentRound(code);
}

const MAX_ATTEMPTS = 20;

export async function createRoom(): Promise<
  { ok: true; code: string } | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const code = generateRoomCode();
    const existing = await prisma.room.findUnique({ where: { code } });
    if (!existing) {
      const room = await prisma.room.create({
        data: {
          code,
          hostId: session.user.id,
          status: "WAITING",
        },
      });
      await prisma.player.create({
        data: {
          userId: session.user.id,
          roomId: room.id,
          role: "CIVILIAN",
        },
      });
      revalidatePath("/");
      return { ok: true, code: room.code };
    }
  }

  return { ok: false, error: "No se pudo generar un código único" };
}

export async function joinRoom(
  input: JoinRoomInput
): Promise<{ ok: true; code: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión" };
  }

  const parsed = joinRoomSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Código inválido",
    };
  }

  const room = await prisma.room.findUnique({
    where: { code: parsed.data.code },
    include: { players: true },
  });

  if (!room) {
    return { ok: false, error: "Sala no encontrada" };
  }
  if (room.status !== "WAITING") {
    return { ok: false, error: "La partida ya empezó" };
  }

  const alreadyIn = room.players.some((p) => p.userId === session.user.id);
  if (alreadyIn) {
    revalidatePath(`/room/${room.code}`);
    return { ok: true, code: room.code };
  }

  await prisma.player.create({
    data: {
      userId: session.user.id,
      roomId: room.id,
      role: "CIVILIAN",
    },
  });

  revalidatePath(`/room/${room.code}`);
  return { ok: true, code: room.code };
}

export async function leaveRoom(
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

  if (!room) {
    return { ok: false, error: "Sala no encontrada" };
  }

  const player = room.players.find((p) => p.userId === session.user.id);
  if (!player) {
    return { ok: true };
  }

  await prisma.player.delete({ where: { id: player.id } });

  const remaining = await prisma.player.count({ where: { roomId: room.id } });
  if (remaining === 0) {
    await prisma.room.delete({ where: { id: room.id } });
  } else if (room.hostId === session.user.id) {
    const nextHost = room.players.find((p) => p.userId !== session.user.id);
    if (nextHost) {
      await prisma.room.update({
        where: { id: room.id },
        data: { hostId: nextHost.userId },
      });
    }
  }

  revalidatePath(`/room/${roomCode}`);
  revalidatePath("/");
  return { ok: true };
}
