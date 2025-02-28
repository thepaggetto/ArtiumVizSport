import { getEventDay } from "@/lib/event-days"
import { MatchList } from "@/components/match-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { notFound } from "next/navigation"

interface EventDayMatchesPageProps {
  params: {
    id: string
  }
}

export default async function EventDayMatchesPage({ params }: EventDayMatchesPageProps) {
  const eventDay = await getEventDay(params.id)

  if (!eventDay) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {format(new Date(eventDay.date), "EEEE d MMMM yyyy", { locale: it })}
            </h1>
            <p className="text-muted-foreground mt-1">
              {eventDay.location} • {eventDay.broadcaster}
            </p>
          </div>
          <Button asChild>
            <Link href={`/matches/new?eventDayId=${eventDay.id}`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi Incontro
            </Link>
          </Button>
        </div>

        <MatchList eventDayId={eventDay.id} />
      </div>
    </main>
  )
}

