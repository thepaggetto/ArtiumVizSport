import { getEventDays } from "@/lib/event-days"
import { EventDayCard } from "@/components/event-day-card"
import { EmptyState } from "@/components/empty-state"

export async function EventDayList() {
  const eventDays = await getEventDays()

  if (eventDays.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-8">
      {eventDays.map((eventDay) => (
        <EventDayCard key={eventDay.id} eventDay={eventDay} />
      ))}
    </div>
  )
}

