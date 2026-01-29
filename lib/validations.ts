import { z } from "zod";

const ROOM_CODE_LENGTH = 4;
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const joinRoomSchema = z.object({
  code: z
    .string()
    .length(ROOM_CODE_LENGTH, "El código debe tener 4 caracteres")
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, "Solo letras y números"),
});

export const voteSchema = z.object({
  targetPlayerId: z.string().cuid(),
  roundId: z.string().cuid(),
});

export const guessWordSchema = z.object({
  guess: z.string().min(1, "Escribe la palabra"),
  roundId: z.string().cuid(),
});

export function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type GuessWordInput = z.infer<typeof guessWordSchema>;
