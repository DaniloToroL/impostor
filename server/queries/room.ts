import { prisma } from "@/lib/db";

export async function getRoom(code: string) {
  return prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      host: { select: { id: true, name: true, image: true } },
      players: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { turnOrder: "asc" },
      },
      rounds: {
        orderBy: { roundNum: "desc" },
        take: 1,
        include: {
          word: { include: { category: true } },
          votes: {
            include: {
              caster: { include: { user: { select: { name: true } } } },
              target: { include: { user: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });
}

export async function getRoomWithCurrentRound(code: string) {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      host: { select: { id: true, name: true, image: true } },
      players: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { turnOrder: "asc" },
      },
      rounds: {
        orderBy: { roundNum: "desc" },
        take: 1,
        include: {
          word: { include: { category: true } },
          votes: true,
        },
      },
    },
  });
  return room;
}
