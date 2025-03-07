"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { FileJson, Edit, Trash2, List, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { it } from "date-fns/locale"
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

interface Match {
  id: string
  name: string
  tipoGara: string
  nomeCampionato: string
  nomePL1: string
  recordPL1: string
  cittaPL1: string
  nazionalitaPL1: string
  svgPL1: string
  nomePL2: string
  recordPL2: string
  cittaPL2: string
  nazionalitaPL2: string
  svgPL2: string
}

interface EventDay {
  id: string
  date: Date | string
  location: string
  broadcaster: string
  matches: Match[]
}

interface EventDayCardProps {
  eventDay: EventDay
}

export function EventDayCard({ eventDay }: EventDayCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/event-days/${eventDay.id}`, {
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

  return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt={eventDay.broadcaster}
                    width={48}
                    height={48}
                    className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{format(new Date(eventDay.date), "EEEE d MMMM yyyy", { locale: it })}</h3>
                <p className="text-sm text-muted-foreground">{eventDay.location}</p>
                <p className="text-sm text-muted-foreground">Broadcaster: {eventDay.broadcaster}</p>
              </div>
            </div>
            <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {eventDay.matches.length} incontri
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href={`/api/public/event-days/${eventDay.id}/matches`} target="_blank" rel="noopener noreferrer">
                <FileJson className="mr-2 h-4 w-4" />
                Endopoint Dati Match
              </Link>
            </Button>

            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href={`/api/public/event-days/${eventDay.id}/players`} target="_blank" rel="noopener noreferrer">
                <Users className="mr-2 h-4 w-4" />
                Endpoint Dati Atleti
              </Link>
            </Button>
          </div>

          {eventDay.matches.length > 0 && (
              <div className="grid gap-4 pt-4 border-t">
                <h4 className="text-sm font-semibold">Incontri in programma</h4>
                <div className="grid gap-4">
                  {eventDay.matches.map((match) => (
                      <div key={match.id} className="rounded-lg border p-4">
                        <div className="mb-2">
                          <span className="text-sm font-medium">{match.name}</span>
                          {match.nomeCampionato && (
                              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {match.nomeCampionato}
                      </span>
                          )}
                          <span className="block text-xs text-muted-foreground">{match.tipoGara}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="relative h-5 w-5 overflow-hidden rounded-full">
                                <Image
                                    src={`https://flagcdn.com/${match.nazionalitaPL1.substring(0, 2).toLowerCase()}.svg`}
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
                                    src={`https://flagcdn.com/${match.nazionalitaPL2.substring(0, 2).toLowerCase()}.svg`}
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
                      </div>
                  ))}
                </div>
              </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/event-days/${eventDay.id}`}>
                <List className="mr-2 h-3.5 w-3.5" />
                Dettagli Giornata
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/event-days/${eventDay.id}/edit`}>
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

