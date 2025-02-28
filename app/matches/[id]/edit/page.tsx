import { MatchForm } from "@/components/match-form"
import { getMatch } from "@/lib/matches"
import { getEventDays } from "@/lib/event-days"
import { notFound } from "next/navigation"

interface EditMatchPageProps {
  params: {
    id: string
  }
}

export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const [match, eventDays] = await Promise.all([getMatch(params.id), getEventDays()])

  if (!match) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Modifica Incontro</h1>
        <MatchForm match={match} eventDays={eventDays} />
      </div>
    </main>
  )
}

