"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Clipboard, Copy, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SingularConfig() {
    const [publicToken, setPublicToken] = useState("")
    const [privateToken, setPrivateToken] = useState("")
    const [streamId, setStreamId] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadConfig() {
            try {
                const response = await fetch("/api/config/singular")
                if (response.ok) {
                    const data = await response.json()
                    setPublicToken(data.publicToken || "")
                    setPrivateToken(data.privateToken || "")
                    setStreamId(data.streamId || "")
                    setError(null)
                } else {
                    const errorData = await response.json()
                    setError(errorData.error || "Errore durante il caricamento della configurazione")
                }
            } catch (error) {
                console.error("Error loading Singular.Live config:", error)
                setError("Impossibile caricare la configurazione")
            } finally {
                setLoading(false)
            }
        }

        loadConfig()
    }, [])

    async function saveConfig() {
        setSaving(true)
        setError(null)

        try {
            const response = await fetch("/api/config/singular", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    publicToken,
                    privateToken,
                    streamId,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Errore durante il salvataggio")
                throw new Error(data.error || "Errore durante il salvataggio")
            }

            toast.success("Configurazione salvata con successo")
        } catch (error) {
            console.error("Error saving Singular.Live config:", error)
            toast.error("Impossibile salvare la configurazione")
        } finally {
            setSaving(false)
        }
    }

    function copyToClipboard(text: string, message: string) {
        navigator.clipboard.writeText(text)
        toast.success(message)
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Caricamento...</div>
    }

    const apiUrl = `${window.location.origin}/api/streams/singular?token=${publicToken}`

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Errore</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Configurazione Singular.Live</CardTitle>
                    <CardDescription>Configura i token per l'integrazione con Singular.Live</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="streamId" className="text-sm font-medium">
                            ID Stream
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="streamId"
                                value={streamId}
                                onChange={(e) => setStreamId(e.target.value)}
                                placeholder="Es. 5554"
                            />
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(streamId, "ID Stream copiato")}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="publicToken" className="text-sm font-medium">
                            Token Pubblico
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="publicToken"
                                value={publicToken}
                                onChange={(e) => setPublicToken(e.target.value)}
                                placeholder="Es. 0FpNhqrR6JjM2yTT26g8CE"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(publicToken, "Token pubblico copiato")}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="privateToken" className="text-sm font-medium">
                            Token Privato
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="privateToken"
                                value={privateToken}
                                onChange={(e) => setPrivateToken(e.target.value)}
                                placeholder="Es. 0M8hecPTS9FxB34GAxVQLO"
                                type="password"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(privateToken, "Token privato copiato")}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL API per Singular.Live</label>
                        <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                            <code className="text-sm break-all">{apiUrl}</code>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiUrl, "URL API copiato")}>
                                <Clipboard className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={saveConfig} disabled={saving}>
                        {saving ? "Salvataggio..." : "Salva Configurazione"}
                    </Button>
                    <Button variant="outline" onClick={() => window.open("https://app.singular.live/streams", "_blank")}>
                        Apri Singular.Live <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Guida all'Integrazione</CardTitle>
                    <CardDescription>Come configurare Singular.Live con ArtiumViz Boxe</CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Accedi al tuo account Singular.Live</li>
                        <li>Vai alla sezione "Data Streams"</li>
                        <li>Crea un nuovo stream o seleziona quello esistente</li>
                        <li>Copia l'ID Stream, il Token Pubblico e il Token Privato</li>
                        <li>Incolla questi valori nei campi sopra e salva</li>
                        <li>In Singular.Live, configura il Data Stream per utilizzare l'URL API fornito</li>
                        <li>Imposta il tipo di stream come "JSON"</li>
                        <li>Imposta un intervallo di aggiornamento (consigliato: 5-10 secondi)</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    )
}

