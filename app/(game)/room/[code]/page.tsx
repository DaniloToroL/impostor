import { auth } from "@/lib/auth";
import { RoomClient } from "./room-client";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await auth();
  const { code } = await params;
  const currentUserId = session?.user?.id ?? null;
  return (
    <RoomClient
      code={code}
      currentUserId={currentUserId}
    />
  );
}


