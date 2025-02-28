import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // First try to find by ID
    let eventDay = await db.eventDay.findUnique({
      where: { id: params.id },
      include: {
        matches: true,
      },
    })

    // If not found by ID, try to find by slug (broadcaster-date)
    if (!eventDay) {
      const [broadcaster, dateStr] = params.id.split("-")
      if (broadcaster && dateStr) {
        const date = new Date(dateStr)
        eventDay = await db.eventDay.findFirst({
          where: {
            AND: [
              { broadcaster: broadcaster.toUpperCase() },
              {
                date: {
                  gte: date,
                  lt: new Date(new Date(date).setDate(date.getDate() + 1)),
                },
              },
            ],
          },
          include: {
            matches: true,
          },
        })
      }
    }

    if (!eventDay) {
      return NextResponse.json({ error: "Event day not found" }, { status: 404 })
    }

    // Get base URL from request headers
    const headersList = headers()
    const host = headersList.get("host") || ""
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`

    // Format matches for Singular.Live
    const matchesObject: Record<string, any> = {}

    eventDay.matches.forEach((match) => {
      matchesObject[match.name] = {
        tipoGara: match.tipoGara,
        nomeCampionato: match.nomeCampionato,
        nomePL1: match.nomePL1,
        recordPL1: match.recordPL1,
        cittaPL1: match.cittaPL1,
        nazionalitaPL1: match.nazionalitaPL1,
        svgPL1: match.svgPL1,
        etàPL1: match.etàPL1,
        pesoPL1: match.pesoPL1,
        altezzaPL1: match.altezzaPL1,
        fotoPL1: match.fotoPL1 ? `${baseUrl}/api/public/images/${match.name}/PL1` : "",
        nomePL2: match.nomePL2,
        recordPL2: match.recordPL2,
        cittaPL2: match.cittaPL2,
        nazionalitaPL2: match.nazionalitaPL2,
        svgPL2: match.svgPL2,
        etàPL2: match.etàPL2,
        pesoPL2: match.pesoPL2,
        altezzaPL2: match.altezzaPL2,
        fotoPL2: match.fotoPL2 ? `${baseUrl}/api/public/images/${match.name}/PL2` : "",
      }
    })

    // Return the formatted data with event details
    const response = `const CompetitionsLookupTable = ${JSON.stringify(
        {
          eventDetails: {
            date: eventDay.date,
            location: eventDay.location,
            broadcaster: eventDay.broadcaster,
          },
          matches: matchesObject,
        },
        null,
        2,
    )}`

    return new NextResponse(response, {
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Failed to fetch matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

