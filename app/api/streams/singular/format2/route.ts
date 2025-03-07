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

        // Formato alternativo: struttura gerarchica
        const formattedData = {
            events: eventDays.map((eventDay) => ({
                id: eventDay.id,
                date: eventDay.date,
                location: eventDay.location,
                broadcaster: eventDay.broadcaster,
                matches: eventDay.matches.map((match) => ({
                    id: match.id,
                    name: match.name,
                    time: match.time,
                    category: match.category,
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
                })),
            })),
            metadata: {
                source: "ArtiumViz Boxe",
                version: "1.0",
                timestamp: new Date().toISOString(),
                count: {
                    events: eventDays.length,
                    matches: eventDays.reduce((total, day) => total + day.matches.length, 0),
                },
            },
        }

        // Restituisci i dati nel formato alternativo
        return NextResponse.json(formattedData, {
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

