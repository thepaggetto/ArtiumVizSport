import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SingularConfig } from "./singular-config"

export default function SettingsPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-2">Impostazioni Sistema</h1>
            <p className="text-muted-foreground mb-6">Configura le impostazioni dell'applicazione</p>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Generale</TabsTrigger>
                    <TabsTrigger value="singular">Singular.Live</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Impostazioni Generali</CardTitle>
                            <CardDescription>Configura le impostazioni di base dell'applicazione.</CardDescription>
                        </CardHeader>
                        <CardContent>{/* Altre impostazioni generali qui */}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="singular">
                    <SingularConfig />
                </TabsContent>
            </Tabs>
        </div>
    )
}

