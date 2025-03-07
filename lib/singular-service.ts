import { db } from "@/lib/db"
import { configService } from "@/lib/config-service"
import { getFlagUrl } from "@/lib/flag-utils"

export type SingularData = Record<string, any>

export const singularService = {
    /**
     * Invia dati a Singular.Live utilizzando il loro endpoint API
     */
    async pushDataToSingular(data: SingularData): Promise<{ success: boolean; message: string }> {
        try {
            // Ottieni la configurazione di Singular.Live
            const config = await configService.getSingularConfig()

            if (!config.privateToken) {
                return {
                    success: false,
                    message: "Token privato di Singular.Live non configurato",
                }
            }

            // Endpoint API di Singular.Live
            const endpoint = `https://datastream.singular.live/datastreams/${config.privateToken}`

            console.log("Sending data to Singular.Live:", JSON.stringify(data).substring(0, 200) + "...")
            console.log("Endpoint:", endpoint)

            // Invia i dati a Singular.Live
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const responseText = await response.text()
            console.log("Response status:", response.status)
            console.log("Response text:", responseText)

            if (!response.ok) {
                throw new Error(`Errore nell'invio dei dati a Singular.Live: ${response.status} ${responseText}`)
            }

            return {
                success: true,
                message: "Dati inviati con successo a Singular.Live",
            }
        } catch (error) {
            console.error("Errore nell'invio dei dati a Singular.Live:", error)
            return {
                success: false,
                message: error instanceof Error ? error.message : "Errore sconosciuto",
            }
        }
    },

    /**
     * Prepara i dati degli incontri per Singular.Live (formato standard)
     */
    async prepareMatchesData(): Promise<SingularData> {
        try {
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
                return { error: "Nessun evento trovato" }
            }

            // Determina il base URL
            let baseUrl = ""
            if (typeof process.env.VERCEL_URL !== "undefined") {
                // Vercel deployment
                baseUrl = `https://${process.env.VERCEL_URL}`
            } else if (typeof process.env.NEXT_PUBLIC_APP_URL !== "undefined") {
                // Custom environment variable
                baseUrl = process.env.NEXT_PUBLIC_APP_URL
            } else {
                // Fallback to localhost in development
                baseUrl =
                    process.env.NODE_ENV === "production"
                        ? "" // This should be replaced with your production URL if known
                        : "http://localhost:3000"
            }

            // Formato piatto per Singular.Live (come richiesto)
            const matchesData: Record<string, any> = {}

            // Helper function to ensure complete URLs
            const getFullUrl = (url: string | null | undefined) => {
                if (!url) return ""
                if (url.startsWith("http://") || url.startsWith("https://")) return url
                return `${baseUrl}${url}`
            }

            // Aggiungi informazioni sugli eventi
            eventDays.forEach((eventDay) => {
                // Aggiungi i match per questo evento
                eventDay.matches.forEach((match) => {
                    // Assicurati che gli URL delle bandiere siano sempre generati correttamente
                    // Ignora eventuali valori svgPL1/svgPL2 esistenti e usa sempre getFlagUrl
                    const flag1 = getFlagUrl(match.nazionalitaPL1)
                    const flag2 = getFlagUrl(match.nazionalitaPL2)

                    // Formato piatto come richiesto
                    matchesData[match.name] = {
                        tipoGara: match.tipoGara || "Prova",
                        nomeCampionato: match.nomeCampionato || "Prova",
                        nomePL1: match.nomePL1 || "",
                        recordPL1: match.recordPL1 || "",
                        cittaPL1: match.cittaPL1 || "",
                        nazionalitaPL1: match.nazionalitaPL1 || "",
                        svgPL1: flag1,
                        etàPL1: match.etàPL1 || "",
                        pesoPL1: match.pesoPL1 || "",
                        altezzaPL1: match.altezzaPL1 || "",
                        fotoPL1: getFullUrl(match.fotoPL1) || `${baseUrl}/api/public/images/${match.name}/PL1`,
                        nomePL2: match.nomePL2 || "",
                        recordPL2: match.recordPL2 || "",
                        cittaPL2: match.cittaPL2 || "",
                        nazionalitaPL2: match.nazionalitaPL2 || "",
                        svgPL2: flag2,
                        etàPL2: match.etàPL2 || "",
                        pesoPL2: match.pesoPL2 || "",
                        altezzaPL2: match.altezzaPL2 || "",
                        fotoPL2: getFullUrl(match.fotoPL2) || `${baseUrl}/api/public/images/${match.name}/PL2`,
                    }
                })
            })

            return matchesData
        } catch (error) {
            console.error("Errore nella preparazione dei dati:", error)
            return { error: error instanceof Error ? error.message : "Errore sconosciuto" }
        }
    },
}

