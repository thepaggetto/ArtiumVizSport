"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Clipboard, Copy, ExternalLink, RefreshCw, Clock, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SingularSettings() {
    const [publicToken, setPublicToken] = useState("")
    const [privateToken, setPrivateToken] = useState("")
    const [streamId, setStreamId] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [pushing, setPushing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [testingConnection, setTestingConnection] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "error">("untested")

    // Stato per l'invio automatico
    const [autoSync, setAutoSync] = useState(false)
    const [syncInterval, setSyncInterval] = useState("5")
    const [lastSync, setLastSync] = useState<string | null>(null)
    const [nextSync, setNextSync] = useState<string | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

    // Gestione dell'invio automatico
    useEffect(() => {
        // Pulisci l'intervallo esistente quando cambia lo stato
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        // Se l'invio automatico è attivo e la connessione è verificata, imposta un nuovo intervallo
        if (autoSync && connectionStatus === "success") {
            const intervalMinutes = Number.parseInt(syncInterval, 10)
            const intervalMs = intervalMinutes * 60 * 1000

            // Imposta il timestamp per il prossimo invio
            const nextSyncTime = new Date(Date.now() + intervalMs)
            setNextSync(nextSyncTime.toLocaleTimeString())

            intervalRef.current = setInterval(async () => {
                await pushDataToSingular()

                // Aggiorna i timestamp
                setLastSync(new Date().toLocaleTimeString())
                const nextSyncTime = new Date(Date.now() + intervalMs)
                setNextSync(nextSyncTime.toLocaleTimeString())
            }, intervalMs)
        } else {
            setNextSync(null)
        }

        // Pulizia quando il componente viene smontato
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [autoSync, syncInterval, connectionStatus])

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
            setConnectionStatus("untested")
        } catch (error) {
            console.error("Error saving Singular.Live config:", error)
            toast.error("Impossibile salvare la configurazione")
        } finally {
            setSaving(false)
        }
    }

    async function testConnection() {
        setTestingConnection(true)
        setError(null)

        try {
            const response = await fetch("/api/singular/test-connection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    privateToken,
                    streamId,
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setConnectionStatus("success")
                toast.success("Connessione a Singular.Live riuscita")
            } else {
                setConnectionStatus("error")
                setError(data.message || "Errore durante il test della connessione")
                toast.error("Impossibile connettersi a Singular.Live")
            }
        } catch (error) {
            setConnectionStatus("error")
            console.error("Error testing connection:", error)
            toast.error("Errore durante il test della connessione")
        } finally {
            setTestingConnection(false)
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
            setLastSync(new Date().toLocaleTimeString())
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

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Configurazione Singular.Live</h1>

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

                        <div className="pt-4">
                            <Button
                                onClick={testConnection}
                                disabled={testingConnection || !privateToken || !streamId}
                                variant="outline"
                                className="w-full"
                            >
                                {testingConnection ? "Verifica in corso..." : "Verifica connessione"}
                            </Button>

                            {connectionStatus === "success" && (
                                <Alert className="mt-2 bg-green-50 border-green-200">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <AlertTitle className="text-green-700">Connessione riuscita</AlertTitle>
                                    <AlertDescription className="text-green-600">
                                        La connessione a Singular.Live è stata verificata con successo.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {connectionStatus === "error" && (
                                <Alert variant="destructive" className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Errore di connessione</AlertTitle>
                                    <AlertDescription>
                                        Impossibile connettersi a Singular.Live. Verifica che il token privato sia corretto.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {!streamId && (
                                <p className="text-xs text-amber-600 mt-1">
                                    È necessario configurare l'ID Stream prima di poter verificare la connessione.
                                </p>
                            )}
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
                        <CardTitle>Invio Dati a Singular.Live</CardTitle>
                        <CardDescription>
                            Invia manualmente i dati degli incontri o imposta un intervallo automatico
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Invio Manuale</h3>
                            <p className="text-sm text-muted-foreground">
                                Invia manualmente i dati degli incontri a Singular.Live. Questo è utile per aggiornare immediatamente i
                                dati dopo aver apportato modifiche.
                            </p>
                            <Button
                                onClick={pushDataToSingular}
                                disabled={pushing || !privateToken || connectionStatus !== "success"}
                                className="w-full"
                            >
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
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium mb-4">Invio Automatico</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto-sync">Sincronizzazione automatica</Label>
                                    <p className="text-sm text-muted-foreground">Invia automaticamente i dati a intervalli regolari</p>
                                </div>
                                <Switch
                                    id="auto-sync"
                                    checked={autoSync}
                                    onCheckedChange={setAutoSync}
                                    disabled={connectionStatus !== "success"}
                                />
                            </div>

                            {autoSync && (
                                <>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Label htmlFor="sync-interval">Intervallo di sincronizzazione:</Label>
                                        <Select
                                            value={syncInterval}
                                            onValueChange={setSyncInterval}
                                            disabled={!autoSync || connectionStatus !== "success"}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Seleziona intervallo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 minuto</SelectItem>
                                                <SelectItem value="5">5 minuti</SelectItem>
                                                <SelectItem value="10">10 minuti</SelectItem>
                                                <SelectItem value="15">15 minuti</SelectItem>
                                                <SelectItem value="30">30 minuti</SelectItem>
                                                <SelectItem value="60">1 ora</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="bg-muted p-3 rounded-md">
                                        <div className="flex items-center text-sm">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span>
                        {lastSync ? (
                            <>
                                Ultimo invio: <span className="font-medium">{lastSync}</span>
                            </>
                        ) : (
                            "Nessun invio effettuato"
                        )}
                      </span>
                                        </div>
                                        {nextSync && (
                                            <div className="flex items-center text-sm mt-1">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>
                          Prossimo invio: <span className="font-medium">{nextSync}</span>
                        </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {!privateToken && (
                                <p className="text-xs text-amber-600 mt-2">
                                    È necessario configurare il token privato prima di poter inviare dati a Singular.Live.
                                </p>
                            )}

                            {privateToken && connectionStatus !== "success" && (
                                <p className="text-xs text-amber-600 mt-2">
                                    È necessario verificare la connessione prima di poter inviare dati a Singular.Live.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="endpoints" className="w-full">


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
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(apiUrlFormat2, "URL API copiato")}
                                        >
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
                            <li>Verifica la connessione usando il pulsante "Verifica connessione"</li>
                            <li>
                                Per l'integrazione con Singular.Live, hai due opzioni:
                                <ul className="list-disc list-inside ml-6 mt-2">
                                    <li>
                                        <strong>Metodo Push (consigliato)</strong>: Invia manualmente i dati o imposta un intervallo di
                                        sincronizzazione automatica
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
        </div>
    )
}

