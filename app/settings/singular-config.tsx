"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Clipboard, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SingularConfig() {
    const [publicToken, setPublicToken] = useState("")
    const [privateToken, setPrivateToken] = useState("")
    const [streamId, setStreamId] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [pushing, setPushing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

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
        setSuccess(null)

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

            setSuccess("Configurazione salvata con successo")
            toast.success("Configurazione salvata con successo")
        } catch (error) {
            console.error("Error saving Singular.Live config:", error)
            toast.error("Impossibile salvare la configurazione")
        } finally {
            setSaving(false)
        }
    }

    async function pushDataToSingular() {
        setPushing(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch("/api/singular/push", {
                method: "POST",
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Errore durante l'invio dei dati a Singular.Live")
                throw new Error(data.message || "Errore durante l'invio dei dati a Singular.Live")
            }

            setSuccess("Dati inviati con successo a Singular.Live")
            toast.success("Dati inviati con successo a Singular.Live")
        } catch (error) {
            console.error("Error pushing data to Singular.Live:", error)
            toast.error("Impossibile inviare i dati a Singular.Live")
        } finally {
            setPushing(false)
        }
    }

    function copyToClipboard(text: string, message: string) {
        navigator.clipboard.writeText(text)
        toast.success(message)
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Caricamento...</div>
    }

    const baseUrl = window.location.origin
    const apiUrl = `${baseUrl}/api/streams/singular?token=${publicToken}`
    const apiUrlFormat2 = `${baseUrl}/api/streams/singular/format2?token=${publicToken}`
    const apiUrlJs = `${baseUrl}/api/streams/singular?token=${publicToken}&format=js`
    const webhookUrl = `${baseUrl}/api/singular/webhook`

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Errore</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Operazione completata</AlertTitle>
                    <AlertDescription className="text-green-600">{success}</AlertDescription>
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
                        <p className="text-xs text-muted-foreground">
                            Il token privato è necessario per inviare dati a Singular.Live. Non condividerlo con nessuno.
                        </p>
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

            <Tabs defaultValue="push" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="push">Invio Dati (Push)</TabsTrigger>
                    <TabsTrigger value="endpoints">Endpoint JSON</TabsTrigger>
                </TabsList>

                <TabsContent value="push">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invio Dati a Singular.Live</CardTitle>
                            <CardDescription>Invia manualmente i dati degli incontri a Singular.Live</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">
                                Puoi inviare manualmente i dati degli incontri a Singular.Live utilizzando il pulsante qui sotto. Questo
                                è utile per aggiornare immediatamente i dati dopo aver apportato modifiche.
                            </p>

                            <Button onClick={pushDataToSingular} disabled={pushing || !privateToken} className="w-full">
                                {pushing ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Invio in corso...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Invia Dati a Singular.Live
                                    </>
                                )}
                            </Button>

                            {!privateToken && (
                                <p className="text-xs text-amber-600">
                                    È necessario configurare il token privato prima di poter inviare dati a Singular.Live.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Webhook per Aggiornamenti Automatici</CardTitle>
                            <CardDescription>Configura un webhook per aggiornare automaticamente i dati</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">
                                Puoi configurare un sistema esterno per chiamare questo webhook ogni volta che desideri aggiornare i
                                dati su Singular.Live. Ad esempio, puoi configurare un cron job per chiamare questo endpoint ogni 5
                                minuti.
                            </p>

                            <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                                <code className="text-sm break-all">{webhookUrl}</code>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(webhookUrl, "URL webhook copiato")}>
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">Metodo: POST</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="endpoints">
                    <Card>
                        <CardHeader>
                            <CardTitle>Endpoint JSON</CardTitle>
                            <CardDescription>URL per accedere direttamente ai dati in formato JSON</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Formato Lookup Table</h3>
                                <p className="text-sm text-muted-foreground mb-2">Formato JSON con i nomi dei match come chiavi.</p>
                                <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                                    <code className="text-sm break-all">{apiUrl}</code>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiUrl, "URL API copiato")}>
                                        <Clipboard className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Formato Gerarchico</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Formato JSON con struttura nidificata di eventi e match.
                                </p>
                                <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                                    <code className="text-sm break-all">{apiUrlFormat2}</code>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiUrlFormat2, "URL API copiato")}>
                                        <Clipboard className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Formato JavaScript</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Formato JavaScript per l'inclusione diretta in pagine web.
                                </p>
                                <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                                    <code className="text-sm break-all">{apiUrlJs}</code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(apiUrlJs, "URL API JavaScript copiato")}
                                    >
                                        <Clipboard className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

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
                        <li>
                            Per l'integrazione con Singular.Live, hai due opzioni:
                            <ul className="list-disc list-inside ml-6 mt-2">
                                <li>
                                    <strong>Metodo Push (consigliato)</strong>: Clicca su "Invia Dati a Singular.Live" per inviare
                                    manualmente i dati o configura un sistema esterno per chiamare il webhook per aggiornamenti automatici
                                </li>
                                <li>
                                    <strong>Metodo Pull</strong>: Configura Singular.Live per recuperare i dati dagli endpoint JSON
                                    forniti
                                </li>
                            </ul>
                        </li>
                    </ol>

                    <div className="mt-4 p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium mb-2">Esempio di accesso ai dati in Singular.Live:</h3>
                        <pre className="text-xs overflow-x-auto">
              {`// Accesso ai dati di un match specifico
var matchData = MatchesLookupTable["Nome del Match"];

// Accesso ai dati del giocatore 1
var player1Name = matchData.player1.name;
var player1Photo = matchData.player1.photo;

// Accesso ai dati dell'evento
var eventDate = matchData.event.date;
var eventLocation = matchData.event.location;`}
            </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

