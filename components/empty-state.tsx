import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Nessun Match Creato</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Non hai ancora creato nessun match. Crea il tuo primo match per iniziare.
          </p>
          <Button asChild>
            <Link href="/matches/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crea Match
            </Link>
          </Button>
        </div>
      </div>
  )
}

