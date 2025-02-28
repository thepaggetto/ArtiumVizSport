import { EventDayForm } from "@/components/event-day-form"
import { getEventDay } from "@/lib/event-days"
import { notFound } from "next/navigation"

interface EditEventDayPageProps {
  params: {
    id: string
  }
}

export default async function EditEventDayPage({ params }: EditEventDayPageProps) {
  const eventDay = await getEventDay(params.id)

  if (!eventDay) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Modifica Giornata</h1>
        <EventDayForm eventDay={eventDay} />
      </div>
    </main>
  )
}

