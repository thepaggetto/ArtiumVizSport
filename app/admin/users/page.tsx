import { UserList } from "@/components/admin/user-list"
import { getCurrentUser } from "@/lib/auth-server"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const currentUser = await getCurrentUser()

  // Redirect non-admin users
  if (!currentUser || !currentUser.isAdmin) {
    redirect("/")
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestione Utenti</h1>
            <p className="text-muted-foreground mt-1">Crea e gestisci gli account utente</p>
          </div>
        </div>

        <UserList />
      </div>
    </main>
  )
}

