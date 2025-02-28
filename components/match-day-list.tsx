import { getMatchDays } from "@/lib/match-days"
import { MatchDayCard } from "@/components/match-day-card"
import { EmptyState } from "@/components/empty-state"

export async function MatchDayList() {
  const matchDays = await getMatchDays()

  if (matchDays.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-6">
      {matchDays.map((matchDay) => (
        <MatchDayCard key={matchDay.id} matchDay={matchDay} />
      ))}
    </div>
  )
}

