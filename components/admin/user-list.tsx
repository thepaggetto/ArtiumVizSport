"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserDialog } from "@/components/admin/user-dialog"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error("Impossibile caricare gli utenti")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Errore durante il caricamento degli utenti:", error)
      toast.error("Impossibile caricare gli utenti")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Impossibile eliminare l'utente")
      }

      toast.success("Utente eliminato con successo")
      fetchUsers()
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'utente:", error)
      toast.error(error instanceof Error ? error.message : "Impossibile eliminare l'utente")
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleSaveUser = async (userData: any) => {
    try {
      setIsSubmitting(true)

      const url = selectedUser ? `/api/admin/users/${selectedUser.id}` : "/api/admin/users"

      const method = selectedUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Impossibile salvare l'utente")
      }

      toast.success(selectedUser ? "Utente aggiornato con successo" : "Utente creato con successo")
      fetchUsers()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Errore durante il salvataggio dell'utente:", error)
      toast.error(error instanceof Error ? error.message : "Impossibile salvare l'utente")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Utenti</CardTitle>
            <CardDescription>Gestisci gli account utente per l'applicazione</CardDescription>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Utente
          </Button>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Nessun utente trovato</h3>
              <p className="text-muted-foreground">Crea un nuovo utente per iniziare.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Creato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? <Badge variant="default">Admin</Badge> : <Badge variant="outline">Utente</Badge>}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifica</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Elimina</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà definitivamente l'account utente di {selectedUser?.name}. Questa azione non può
              essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                "Elimina"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

