import { SeedButton } from "@/components/seed-button"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function SetupPage() {
  // Check if any users exist
  const userCount = await db.user.count()

  // If users exist, redirect to login
  if (userCount > 0) {
    redirect("/login")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Configura Account Amministratore</h1>
          <p className="text-sm text-muted-foreground">Crea l'utente amministratore iniziale per iniziare</p>
        </div>
        <div className="rounded-lg border p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">Questo creerà un utente amministratore con le seguenti credenziali:</p>
              <div className="rounded-md bg-secondary p-3">
                <p className="text-sm">
                  <strong>Email:</strong> admin@example.com
                </p>
                <p className="text-sm">
                  <strong>Password:</strong> admin123
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Assicurati di cambiare queste credenziali dopo aver effettuato l'accesso.
              </p>
            </div>
            <SeedButton />
          </div>
        </div>
      </div>
    </div>
  )
}

