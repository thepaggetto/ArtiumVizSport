"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSave: (data: any) => void
  isSubmitting: boolean
}

const userFormSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri").optional().or(z.literal("")),
  isAdmin: z.boolean().default(false),
})

export function UserDialog({ open, onOpenChange, user, onSave, isSubmitting }: UserDialogProps) {
  const isEditing = !!user

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      isAdmin: user?.isAdmin || false,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        isAdmin: user?.isAdmin || false,
      })
    }
  }, [open, user, form])

  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    // If editing and password is empty, remove it from the data
    if (isEditing && (!data.password || data.password.trim() === "")) {
      const { password, ...dataWithoutPassword } = data
      onSave(dataWithoutPassword)
    } else {
      onSave(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifica Utente" : "Crea Utente"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Aggiorna i dettagli e i permessi dell'utente." : "Aggiungi un nuovo utente al sistema."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Mario Rossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mario@esempio.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "Nuova Password (lascia vuoto per mantenere quella attuale)" : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={isEditing ? "••••••••" : "Inserisci password"} type="password" {...field} />
                  </FormControl>
                  {isEditing && <FormDescription>Lascia vuoto per mantenere la password attuale</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Amministratore</FormLabel>
                    <FormDescription>Concedi privilegi di amministratore a questo utente</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Aggiornamento..." : "Creazione..."}
                  </>
                ) : isEditing ? (
                  "Aggiorna Utente"
                ) : (
                  "Crea Utente"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

