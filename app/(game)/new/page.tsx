"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/server/actions/room";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const result = await createRoom();
    setLoading(false);
    if (result.ok) {
      toast.success("Sala creada");
      router.push(`/room/${result.code}`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">Crear sala</h1>
          <p className="text-center text-muted-foreground text-sm">
            Genera un código para que otros se unan
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handleCreate}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              "Crear sala"
            )}
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Volver</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
