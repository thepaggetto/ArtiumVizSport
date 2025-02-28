import { ExportMatches } from "@/components/export-matches"

export default function ExportMatchesPage() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Esporta Incontri</h1>
        <ExportMatches />
      </div>
    </main>
  )
}

