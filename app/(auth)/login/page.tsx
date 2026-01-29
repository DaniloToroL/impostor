import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

async function signInWithGoogle(formData: FormData) {
  "use server";
  const callbackUrl = (formData.get("callbackUrl") as string) ?? "/new";
  await signIn("google", { redirectTo: callbackUrl });
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // JWTSessionError etc.: invalid/old cookie or missing AUTH_SECRET - treat as no session
  }
  const { callbackUrl } = await searchParams;
  const redirectTo = callbackUrl ?? "/new";

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">
            Juego del Impostor
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            Inicia sesión para jugar
          </p>
        </CardHeader>
        <CardContent>
          <form action={signInWithGoogle}>
            <input
              type="hidden"
              name="callbackUrl"
              value={redirectTo}
            />
            <Button type="submit" className="w-full" size="lg">
              Continuar con Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
