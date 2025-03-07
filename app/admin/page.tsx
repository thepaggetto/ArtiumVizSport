import Link from "next/link"
import { Users, Database, Settings2, BarChart } from "lucide-react"

export default function AdminPage() {
  return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Pannello Amministratore</h1>
        <p className="text-muted-foreground mb-6">Gestisci le impostazioni dell'applicazione e gli utenti</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Gestione Utenti */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestione Utenti
            </h2>
            <p className="text-muted-foreground mb-4">Crea e gestisci gli account utente</p>
            <p className="text-sm text-muted-foreground mb-4">
              Aggiungi, modifica o rimuovi utenti e gestisci i loro permessi.
            </p>
            <Link
                href="/admin/users"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Gestisci Utenti
            </Link>
          </div>

          {/* Boxing Match Management */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Boxing Match Management
            </h2>
            <p className="text-muted-foreground mb-4">
              Visualizza e gestisci tutti gli incontri di pugilato nel sistema.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Gestisci gli incontri, i pugili e i dettagli degli eventi.
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Visualizza Incontri
            </Link>
          </div>

          {/* Impostazioni Sistema */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Impostazioni API e Push Dati
            </h2>
            <p className="text-muted-foreground mb-4">Configura lo stream dati </p>
            <div className="space-y-2">
              <Link
                  href="/settings/singular"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Configura Push Dati
              </Link>

            </div>
          </div>
        </div>
      </div>
  )
}

