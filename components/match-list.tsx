import { getMatches } from "@/lib/matches"
import { MatchCard } from "@/components/match-card"
import { EmptyState } from "@/components/empty-state"

interface MatchListProps {
  eventDayId?: string
}

export async function MatchList({ eventDayId }: MatchListProps) {
  const matches = await getMatches()

  // Filter matches by eventDayId if provided
  const filteredMatches = eventDayId ? matches.filter((match) => match.eventDayId === eventDayId) : matches

  if (filteredMatches.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}

