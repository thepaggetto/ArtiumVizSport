import { MatchForm } from "@/components/match-form"
import { getEventDays } from "@/lib/event-days"
import { redirect } from "next/navigation"

interface NewMatchPageProps {
  searchParams: {
    eventDayId?: string
  }
}

export default async function NewMatchPage({ searchParams }: NewMatchPageProps) {
  const eventDays = await getEventDays()

  // If there are no event days, redirect to create one
  if (eventDays.length === 0) {
    redirect("/event-days/new")
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Aggiungi Nuovo Incontro</h1>
        <MatchForm eventDayId={searchParams.eventDayId} eventDays={eventDays} />
      </div>
    </main>
  )
}

