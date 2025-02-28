"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { Match, Country, EventDay } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { format } from "date-fns"
import { it } from "date-fns/locale"

interface MatchFormProps {
    match?: Match
    eventDayId?: string
    eventDays: EventDay[]
}

const formSchema = z.object({
    eventDayId: z.string().min(1, "La giornata è obbligatoria"),
    name: z.string().min(1, "Il nome dell'incontro è obbligatorio"),
    tipoGara: z.string().min(1, "Il tipo di incontro è obbligatorio"),
    nomeCampionato: z.string().optional(),
    nomePL1: z.string().min(1, "Il nome del pugile 1 è obbligatorio"),
    recordWPL1: z.coerce.number().min(0, "Il numero di vittorie non può essere negativo"),
    recordLPL1: z.coerce.number().min(0, "Il numero di sconfitte non può essere negativo"),
    recordDPL1: z.coerce.number().min(0, "Il numero di pareggi non può essere negativo"),
    cittaPL1: z.string().min(1, "La città del pugile 1 è obbligatoria"),
    nazionalitaPL1: z.string().min(1, "La nazionalità del pugile 1 è obbligatoria"),
    etàPL1: z.string().min(1, "L'età del pugile 1 è obbligatoria"),
    pesoPL1: z.string().min(1, "Il peso del pugile 1 è obbligatoria"),
    altezzaPL1: z.string().min(1, "L'altezza del pugile 1 è obbligatoria"),
    fotoPL1: z.string().optional(),
    nomePL2: z.string().min(1, "Il nome del pugile 2 è obbligatorio"),
    recordWPL2: z.coerce.number().min(0, "Il numero di vittorie non può essere negativo"),
    recordLPL2: z.coerce.number().min(0, "Il numero di sconfitte non può essere negativo"),
    recordDPL2: z.coerce.number().min(0, "Il numero di pareggi non può essere negativo"),
    cittaPL2: z.string().min(1, "La città del pugile 2 è obbligatoria"),
    nazionalitaPL2: z.string().min(1, "La nazionalità del pugile 2 è obbligatoria"),
    etàPL2: z.string().min(1, "L'età del pugile 2 è obbligatoria"),
    pesoPL2: z.string().min(1, "Il peso del pugile 2 è obbligatoria"),
    altezzaPL2: z.string().min(1, "L'altezza del pugile 2 è obbligatoria"),
    fotoPL2: z.string().optional(),
})

export function MatchForm({ match, eventDayId, eventDays = [] }: MatchFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [countries, setCountries] = useState<Country[]>([])
    const [uploadingPL1, setUploadingPL1] = useState(false)
    const [uploadingPL2, setUploadingPL2] = useState(false)
    const [previewPL1, setPreviewPL1] = useState<string | null>(match?.fotoPL1 || null)
    const [previewPL2, setPreviewPL2] = useState<string | null>(match?.fotoPL2 || null)

    // Parse record string into W-L-D numbers
    const parseRecord = (record: string) => {
        const matches = record.match(/(\d+)W-(\d+)L-(\d+)D/)
        if (matches) {
            return {
                wins: Number.parseInt(matches[1]),
                losses: Number.parseInt(matches[2]),
                draws: Number.parseInt(matches[3]),
            }
        }
        return { wins: 0, losses: 0, draws: 0 }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: match
            ? {
                eventDayId: match.eventDayId,
                name: match.name,
                tipoGara: match.tipoGara,
                nomeCampionato: match.nomeCampionato,
                nomePL1: match.nomePL1,
                recordWPL1: parseRecord(match.recordPL1).wins,
                recordLPL1: parseRecord(match.recordPL1).losses,
                recordDPL1: parseRecord(match.recordPL1).draws,
                cittaPL1: match.cittaPL1,
                nazionalitaPL1: match.nazionalitaPL1,
                etàPL1: match.etàPL1,
                pesoPL1: match.pesoPL1,
                altezzaPL1: match.altezzaPL1,
                fotoPL1: match.fotoPL1 || "",
                nomePL2: match.nomePL2,
                recordWPL2: parseRecord(match.recordPL2).wins,
                recordLPL2: parseRecord(match.recordPL2).losses,
                recordDPL2: parseRecord(match.recordPL2).draws,
                cittaPL2: match.cittaPL2,
                nazionalitaPL2: match.nazionalitaPL2,
                etàPL2: match.etàPL2,
                pesoPL2: match.pesoPL2,
                altezzaPL2: match.altezzaPL2,
                fotoPL2: match.fotoPL2 || "",
            }
            : {
                eventDayId: eventDayId || "",
                name: "",
                tipoGara: "",
                nomeCampionato: "",
                nomePL1: "",
                recordWPL1: 0,
                recordLPL1: 0,
                recordDPL1: 0,
                cittaPL1: "",
                nazionalitaPL1: "",
                etàPL1: "",
                pesoPL1: "",
                altezzaPL1: "",
                fotoPL1: "",
                nomePL2: "",
                recordWPL2: 0,
                recordLPL2: 0,
                recordDPL2: 0,
                cittaPL2: "",
                nazionalitaPL2: "",
                etàPL2: "",
                pesoPL2: "",
                altezzaPL2: "",
                fotoPL2: "",
            },
    })

    // Load countries
    useEffect(() => {
        async function fetchCountries() {
            try {
                const response = await fetch("/api/countries")
                const data = await response.json()
                setCountries(data)
            } catch (error) {
                console.error("Impossibile caricare i paesi:", error)
                toast.error("Impossibile caricare i paesi")
            }
        }

        fetchCountries()
    }, [])

    // Update flag URLs when countries change
    useEffect(() => {
        const watchNazionalitaPL1 = form.watch("nazionalitaPL1")
        const watchNazionalitaPL2 = form.watch("nazionalitaPL2")

        if (watchNazionalitaPL1 && countries.length > 0) {
            const country = countries.find((c) => c.name === watchNazionalitaPL1)
            if (country) {
                form.setValue("svgPL1", country.flag)
            }
        }

        if (watchNazionalitaPL2 && countries.length > 0) {
            const country = countries.find((c) => c.name === watchNazionalitaPL2)
            if (country) {
                form.setValue("svgPL2", country.flag)
            }
        }
    }, [countries, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            // Format the record strings
            const formattedValues = {
                ...values,
                recordPL1: `${values.recordWPL1}W-${values.recordLPL1}L-${values.recordDPL1}D`,
                recordPL2: `${values.recordWPL2}W-${values.recordLPL2}L-${values.recordDPL2}D`,
            }

            const endpoint = match ? `/api/matches/${match.id}` : "/api/matches"
            const method = match ? "PUT" : "POST"

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedValues),
            })

            if (!response.ok) {
                throw new Error("Impossibile salvare l'incontro")
            }

            toast.success(match ? "Incontro aggiornato con successo" : "Incontro creato con successo")
            router.push(`/event-days/${values.eventDayId}`)
            router.refresh()
        } catch (error) {
            console.error("Errore durante il salvataggio dell'incontro:", error)
            toast.error("Impossibile salvare l'incontro")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (file: File, player: "PL1" | "PL2") => {
        if (!file) return

        if (player === "PL1") {
            setUploadingPL1(true)
        } else {
            setUploadingPL2(true)
        }

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("player", player)

            // Get the match name for the file path
            const matchName = form.getValues("name")
            if (matchName) {
                formData.append("matchName", matchName)
            } else {
                toast.error("Inserisci prima il nome dell'incontro")
                return
            }

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Impossibile caricare l'immagine")
            }

            const data = await response.json()

            if (player === "PL1") {
                form.setValue("fotoPL1", data.url)
                setPreviewPL1(data.url)
            } else {
                form.setValue("fotoPL2", data.url)
                setPreviewPL2(data.url)
            }

            toast.success("Immagine caricata con successo")
        } catch (error) {
            console.error("Errore durante il caricamento dell'immagine:", error)
            toast.error("Impossibile caricare l'immagine")
        } finally {
            if (player === "PL1") {
                setUploadingPL1(false)
            } else {
                setUploadingPL2(false)
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="eventDayId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giornata</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona giornata" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Array.isArray(eventDays) &&
                                        eventDays.map((eventDay) => (
                                            <SelectItem key={eventDay.id} value={eventDay.id}>
                                                {format(new Date(eventDay.date), "EEEE d MMMM yyyy", { locale: it })} - {eventDay.location}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>La giornata in cui si svolgerà l'incontro</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Incontro</FormLabel>
                                <FormControl>
                                    <Input placeholder="es. Gara1" {...field} />
                                </FormControl>
                                <FormDescription>L'identificatore univoco per questo incontro</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tipoGara"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo Incontro</FormLabel>
                                <FormControl>
                                    <Input placeholder="es. Peso Medio Massimi 6x3" {...field} />
                                </FormControl>
                                <FormDescription>Il tipo e il formato dell'incontro</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nomeCampionato"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Campionato (Opzionale)</FormLabel>
                                <FormControl>
                                    <Input placeholder="es. Campionato Nazionale" {...field} />
                                </FormControl>
                                <FormDescription>Il nome del campionato se applicabile</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Dettagli Pugile 1</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="nomePL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome pugile 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="recordWPL1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vittorie</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recordLPL1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sconfitte</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recordDPL1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pareggi</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="cittaPL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Città</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Città pugile 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nazionalitaPL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazionalità</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            const country = countries.find((c) => c.name === value)
                                            if (country) {
                                                form.setValue("svgPL1", country.flag)
                                            }
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona nazionalità" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.code} value={country.name}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="etàPL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Età</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Età pugile 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pesoPL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Peso</FormLabel>
                                    <FormControl>
                                        <Input placeholder="es. 080,500KG" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="altezzaPL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Altezza</FormLabel>
                                    <FormControl>
                                        <Input placeholder="es. 180,000cm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fotoPL1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Foto</FormLabel>
                                    <div className="space-y-4">
                                        {previewPL1 && (
                                            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                                <Image
                                                    src={previewPL1 || "/placeholder.svg"}
                                                    alt="Foto pugile 1"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <FormControl>
                                                <Input type="hidden" {...field} />
                                            </FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploadingPL1}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleFileUpload(e.target.files[0], "PL1")
                                                        }
                                                    }}
                                                    className="max-w-xs"
                                                />
                                                {uploadingPL1 && <Loader2 className="h-4 w-4 animate-spin" />}
                                            </div>
                                        </div>
                                    </div>
                                    <FormDescription>Carica una foto del pugile (opzionale)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Dettagli Pugile 2</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="nomePL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome pugile 2" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="recordWPL2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vittorie</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recordLPL2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sconfitte</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recordDPL2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pareggi</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="cittaPL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Città</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Città pugile 2" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nazionalitaPL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazionalità</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            const country = countries.find((c) => c.name === value)
                                            if (country) {
                                                form.setValue("svgPL2", country.flag)
                                            }
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona nazionalità" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.code} value={country.name}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="etàPL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Età</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Età pugile 2" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pesoPL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Peso</FormLabel>
                                    <FormControl>
                                        <Input placeholder="es. 080,500KG" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="altezzaPL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Altezza</FormLabel>
                                    <FormControl>
                                        <Input placeholder="es. 180,000cm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fotoPL2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Foto</FormLabel>
                                    <div className="space-y-4">
                                        {previewPL2 && (
                                            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                                <Image
                                                    src={previewPL2 || "/placeholder.svg"}
                                                    alt="Foto pugile 2"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <FormControl>
                                                <Input type="hidden" {...field} />
                                            </FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploadingPL2}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleFileUpload(e.target.files[0], "PL2")
                                                        }
                                                    }}
                                                    className="max-w-xs"
                                                />
                                                {uploadingPL2 && <Loader2 className="h-4 w-4 animate-spin" />}
                                            </div>
                                        </div>
                                    </div>
                                    <FormDescription>Carica una foto del pugile (opzionale)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/event-days/${match?.eventDayId || eventDayId}`)}
                        disabled={isLoading}
                    >
                        Annulla
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {match ? "Aggiorna Incontro" : "Crea Incontro"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

