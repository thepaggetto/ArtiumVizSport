import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthCheck } from "@/components/auth-check"
import { isAuthenticated } from "@/lib/auth-server"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "ArtiumViz Boxe",
    description: "Crea e gestisci incontri di boxe per Singular.Live",
    icons: {
        icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
        apple: [{ url: "/apple-icon.png" }],
    },
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode
}>) {
    const authenticated = await isAuthenticated()

    return (
        <html lang="it" suppressHydrationWarning>
        <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthCheck isAuthenticated={authenticated}>
                <Header isAuthenticated={authenticated} />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster />
            </AuthCheck>
        </ThemeProvider>
        </body>
        </html>
    )
}

