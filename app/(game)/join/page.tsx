import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JoinRoomForm } from "@/components/game/join-room-form";
import Link from "next/link";

export default function JoinRoomPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">Unirse a sala</h1>
          <p className="text-center text-muted-foreground text-sm">
            Introduce el código de 4 caracteres
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <JoinRoomForm />
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Volver</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
