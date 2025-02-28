    "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { EventDay } from "@/lib/types"

const formSchema = z.object({
  date: z.string().min(1, "La data è obbligatoria"),
  location: z.string().min(1, "La location è obbligatoria"),
  broadcaster: z.string().min(1, "Il broadcaster è obbligatorio"),
})

interface EventDayFormProps {
  eventDay?: EventDay
}

export function EventDayForm({ eventDay }: EventDayFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: eventDay
      ? {
          date: new Date(eventDay.date).toISOString().split("T")[0],
          location: eventDay.location,
          broadcaster: eventDay.broadcaster,
        }
      : {
          date: new Date().toISOString().split("T")[0],
          location: "",
          broadcaster: "",
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const endpoint = eventDay ? `/api/event-days/${eventDay.id}` : "/api/event-days"
      const method = eventDay ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Impossibile salvare la giornata")
      }

      toast.success(eventDay ? "Giornata aggiornata con successo" : "Giornata creata con successo")
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Errore durante il salvataggio della giornata:", error)
      toast.error("Impossibile salvare la giornata")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>La data in cui si svolgeranno gli incontri</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="es. PalaSport Roma" {...field} />
              </FormControl>
              <FormDescription>Il luogo dove si svolgeranno gli incontri</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broadcaster"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broadcaster</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona broadcaster" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DAZN">DAZN</SelectItem>
                  <SelectItem value="Rai Sport HD">Rai Sport HD</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Host Broadcaster</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isLoading}>
            Annulla
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {eventDay ? "Aggiorna Giornata" : "Crea Giornata"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

