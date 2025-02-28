"use client"

import type { Match } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
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
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/matches/${match.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Impossibile eliminare l'incontro")
      }

      toast.success("Incontro eliminato con successo")
      router.refresh()
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'incontro:", error)
      toast.error("Impossibile eliminare l'incontro")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{match.name}</h3>
              <p className="text-sm text-muted-foreground">{match.tipoGara}</p>
            </div>
            {match.nomeCampionato && (
                <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {match.nomeCampionato}
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5 overflow-hidden rounded-full">
                  <Image
                      src={`https://flagcdn.com/w40/${match.nazionalitaPL1.substring(0, 2).toLowerCase()}.png`}
                      alt={match.nazionalitaPL1}
                      fill
                      className="object-cover"
                  />
                </div>
                <span className="font-medium">{match.nomePL1}</span>
              </div>
              <p className="text-xs text-muted-foreground">{match.recordPL1}</p>
              <p className="text-xs text-muted-foreground">
                {match.cittaPL1}, {match.nazionalitaPL1}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5 overflow-hidden rounded-full">
                  <Image
                      src={`https://flagcdn.com/w40/${match.nazionalitaPL2.substring(0, 2).toLowerCase()}.png`}
                      alt={match.nazionalitaPL2}
                      fill
                      className="object-cover"
                  />
                </div>
                <span className="font-medium">{match.nomePL2}</span>
              </div>
              <p className="text-xs text-muted-foreground">{match.recordPL2}</p>
              <p className="text-xs text-muted-foreground">
                {match.cittaPL2}, {match.nazionalitaPL2}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/matches/${match.id}/edit`}>
                <Edit className="mr-2 h-3.5 w-3.5" />
                Modifica
              </Link>
            </Button>
            <Button variant="secondary" size="sm">
              <Copy className="mr-2 h-3.5 w-3.5" />
              Esporta
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Elimina
            </Button>
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione eliminerà definitivamente l'incontro "{match.name}". Questa azione non può essere
                  annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
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
        </CardFooter>
      </Card>
  )
}

