"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinRoom } from "@/server/actions/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2Icon, ArrowRightIcon } from "lucide-react";

interface JoinRoomFormProps {
  compact?: boolean;
}

export function JoinRoomForm({ compact = false }: JoinRoomFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Escribe el código de la sala");
      return;
    }
    setLoading(true);
    const result = await joinRoom({ code: code.trim().toUpperCase() });
    setLoading(false);
    if (result.ok) {
      toast.success("Te uniste a la sala");
      router.push(`/room/${result.code}`);
    } else {
      toast.error(result.error);
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleJoin} className="flex gap-2">
        <Input
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
          maxLength={4}
          className="w-24 text-center font-mono uppercase"
        />
        <Button type="submit" disabled={loading} variant="outline" size="icon">
          {loading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleJoin} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="Ej: XK4L"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
          maxLength={4}
          className="text-center text-lg font-mono uppercase"
        />
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            "Entrar"
          )}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Ingresa el código de 4 caracteres de la sala
      </p>
    </form>
  );
}
