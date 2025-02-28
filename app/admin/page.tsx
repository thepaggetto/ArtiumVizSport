import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, BoxIcon, Settings } from "lucide-react"

export default async function AdminPage() {
  const currentUser = await getCurrentUser()

  // Redirect non-admin users
  if (!currentUser || !currentUser.isAdmin) {
    redirect("/")
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pannello Amministratore</h1>
          <p className="text-muted-foreground mt-1">Gestisci le impostazioni dell'applicazione e gli utenti</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Gestione Utenti</CardTitle>
              <CardDescription>Crea e gestisci gli account utente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Aggiungi, modifica o rimuovi utenti e gestisci i loro permessi.
              </p>
              <Button asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Gestisci Utenti
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Boxing Match Management</CardTitle>

            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualizza e gestisci tutti gli incontri di pugilato nel sistema.
              </p>
              <Button asChild>
                <Link href="/">
                  <BoxIcon className="mr-2 h-4 w-4" />
                  Visualizza Incontri
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Impostazioni Sistema</CardTitle>
              <CardDescription>Configura le impostazioni dell'applicazione</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Regola le impostazioni di sistema e le preferenze.</p>
              <Button asChild variant="outline">
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Impostazioni
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

