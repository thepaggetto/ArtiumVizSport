import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { configService } from "@/lib/config-service"

export async function GET(request: Request) {
    try {
        // Ottieni il token dalla query string
        const { searchParams } = new URL(request.url)
        const token = searchParams.get("token")

        // Recupera la configurazione
        const config = await configService.getSingularConfig()

        // Verifica il token
        if (!token || token !== config.publicToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                {
                    status: 401,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, OPTIONS",
                    },
                },
            )
        }

        // Ottieni tutti gli eventi del giorno corrente
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const eventDays = await db.eventDay.findMany({
            where: {
                date: {
                    gte: today,
                },
            },
            include: {
                matches: true,
            },
            orderBy: {
                date: "asc",
            },
        })

        if (!eventDays || eventDays.length === 0) {
            return NextResponse.json(
                { error: "No events found" },
                {
                    status: 404,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, OPTIONS",
                    },
                },
            )
        }

        // Ottieni il base URL per i percorsi delle immagini
        const headersList = headers()
        const host = headersList.get("host") || ""
        const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
        const baseUrl = `${protocol}://${host}`

        // Crea un oggetto con i match come chiavi
        // Questo è il formato preferito da Singular.Live per le lookup table
        const matchesData: Record<string, any> = {}

        eventDays.forEach((eventDay) => {
            eventDay.matches.forEach((match) => {
                matchesData[match.name] = {
                    id: match.id,
                    time: match.time,
                    category: match.category,
                    event: {
                        date: eventDay.date,
                        location: eventDay.location,
                        broadcaster: eventDay.broadcaster,
                    },
                    player1: {
                        name: match.nomePL1 || "",
                        record: match.recordPL1 || "",
                        city: match.cittaPL1 || "",
                        nationality: match.nazionalitaPL1 || "",
                        age: match.etàPL1 || "",
                        weight: match.pesoPL1 || "",
                        height: match.altezzaPL1 || "",
                        photo: match.fotoPL1 ? `${baseUrl}/api/public/images/${match.name}/PL1` : "",
                    },
                    player2: {
                        name: match.nomePL2 || "",
                        record: match.recordPL2 || "",
                        city: match.cittaPL2 || "",
                        nationality: match.nazionalitaPL2 || "",
                        age: match.etàPL2 || "",
                        weight: match.pesoPL2 || "",
                        height: match.altezzaPL2 || "",
                        photo: match.fotoPL2 ? `${baseUrl}/api/public/images/${match.name}/PL2` : "",
                    },
                }
            })
        })

        // Formato JavaScript per Singular.Live
        const format = searchParams.get("format")
        if (format === "js") {
            return new NextResponse(`const MatchesLookupTable = ${JSON.stringify(matchesData, null, 2)};`, {
                headers: {
                    "Content-Type": "application/javascript",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
                },
            })
        }

        // Restituisci i dati nel formato JSON standard
        return NextResponse.json(matchesData, {
            headers: {
                "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
            },
        })
    } catch (error) {
        console.error("Error in Singular.Live stream:", error)
        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                },
            },
        )
    }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    })
}

