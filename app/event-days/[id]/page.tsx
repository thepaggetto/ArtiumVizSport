import { getEventDay } from "@/lib/event-days"
import { MatchList } from "@/components/match-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { notFound } from "next/navigation"
import Image from "next/image"

interface EventDayPageProps {
  params: {
    id: string
  }
}

export default async function EventDayPage({ params }: EventDayPageProps) {
  const eventDay = await getEventDay(params.id)

  if (!eventDay) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="mb-auto">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="ml-2">Torna alle giornate</span>
              </Link>
            </Button>
          </div>
          <Button asChild>
            <Link href={`/matches/new?eventDayId=${eventDay.id}`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi Incontro
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt={eventDay.broadcaster}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {format(new Date(eventDay.date), "EEEE d MMMM yyyy", { locale: it })}
            </h1>
            <p className="text-muted-foreground mt-1">
              {eventDay.location} • {eventDay.broadcaster}
            </p>
          </div>
        </div>

        <MatchList eventDayId={eventDay.id} />
      </div>
    </main>
  )
}

