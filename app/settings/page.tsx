import { Users, Database, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function SettingsPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-2">Impostazioni Sistema</h1>
            <p className="text-muted-foreground mb-6">Configura le impostazioni dell'applicazione</p>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Generale</TabsTrigger>
                    <TabsTrigger value="integrations">Integrazioni</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Impostazioni Generali</CardTitle>
                            <CardDescription>Configura le impostazioni di base dell'applicazione.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Link href="/admin/users" className="block">
                                    <Card className="h-full transition-all hover:shadow-md">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="h-5 w-5" />
                                                Gestione Utenti
                                            </CardTitle>
                                            <CardDescription>Gestisci gli account utente</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>

                                <Link href="/admin/matches" className="block">
                                    <Card className="h-full transition-all hover:shadow-md">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Database className="h-5 w-5" />
                                                Gestione Incontri
                                            </CardTitle>
                                            <CardDescription>Gestisci gli incontri di pugilato</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Integrazioni</CardTitle>
                            <CardDescription>Gestisci le integrazioni con servizi esterni.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/settings/singular" className="block">
                                <Card className="transition-all hover:shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart className="h-5 w-5" />
                                            Singular.Live
                                        </CardTitle>
                                        <CardDescription>Configura l'integrazione con Singular.Live</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

