import { EventDayForm } from "@/components/event-day-form"

export default function NewEventDayPage() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Crea Nuova Giornata</h1>
        <EventDayForm />
      </div>
    </main>
  )
}

