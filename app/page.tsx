import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { JoinRoomForm } from "@/components/game/join-room-form";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Juego del Impostor
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Un jugador es el impostor y no conoce la palabra. Los demás deben
        descubrirlo.
      </p>
      {session?.user ? (
        <div className="flex flex-col items-center gap-6">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/new">Crear sala</Link>
          </Button>
          
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase">o</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="w-full max-w-xs">
            <JoinRoomForm />
          </div>
        </div>
      ) : (
        <Button asChild size="lg" className="min-w-[200px]">
          <Link href="/login">Iniciar sesión con Google</Link>
        </Button>
      )}
    </div>
  );
}
