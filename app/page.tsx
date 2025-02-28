import { Suspense } from "react"
import { EventDayList } from "@/components/event-day-list"
import { EventDayListSkeleton } from "@/components/event-day-list-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Boxing Match Management</h1>

          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/event-days/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Giornata
              </Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<EventDayListSkeleton />}>
          <EventDayList />
        </Suspense>
      </div>
    </main>
  )
}

