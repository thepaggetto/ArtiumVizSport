"use client"

import type { MatchDay } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, FileJson, List, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
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
import { format } from "date-fns"
import { it } from "date-fns/locale"

interface MatchDayCardProps {
  matchDay: MatchDay
}

export function MatchDayCard({ matchDay }: MatchDayCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/matchdays/${matchDay.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Impossibile eliminare la giornata")
      }

      toast.success("Giornata eliminata con successo")
      router.refresh()
    } catch (error) {
      console.error("Errore durante l'eliminazione della giornata:", error)
      toast.error("Impossibile eliminare la giornata")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const copyJsonUrl = (type: "matches" | "singular") => {
    const baseUrl = window.location.origin
    const url = `${baseUrl}/api/public/matchdays/${matchDay.id}/matches${type === "singular" ? "/singular" : ""}`
    navigator.clipboard.writeText(url)
    toast.success("URL copiato negli appunti")
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{format(new Date(matchDay.date), "EEEE d MMMM yyyy", { locale: it })}</h3>
            <p className="text-sm text-muted-foreground">{matchDay.location}</p>
            <p className="text-sm text-muted-foreground">Broadcaster: {matchDay.broadcaster}</p>
          </div>
          <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {matchDay.matches.length} incontri
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => copyJsonUrl("matches")}>
              <FileJson className="mr-2 h-3.5 w-3.5" />
              Copia URL JSON Matches
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => copyJsonUrl("singular")}>
              <FileJson className="mr-2 h-3.5 w-3.5" />
              Copia URL JSON Singular
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/matchdays/${matchDay.id}`}>
              <List className="mr-2 h-3.5 w-3.5" />
              Visualizza Incontri
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/matchdays/${matchDay.id}/edit`}>
              <Edit className="mr-2 h-3.5 w-3.5" />
              Modifica
            </Link>
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
                Questa azione eliminerà definitivamente la giornata e tutti gli incontri associati. Questa azione non
                può essere annullata.
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

