import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings2, BarChart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
    return (
        <header className="border-b">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl">
                        ArtiumViz Boxe
                    </Link>
                    {/* Altri link di navigazione */}
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings2 className="h-5 w-5" />
                                <span className="sr-only">Impostazioni</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/settings/singular" className="flex items-center">
                                    <BarChart className="mr-2 h-4 w-4" />
                                    Singular.Live
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings" className="flex items-center">
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    Impostazioni Sistema
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

