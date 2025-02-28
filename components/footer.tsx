export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-6 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-muted-foreground">© {currentYear} ArtiumViz Sport è un prodotto Luckyhorn Entertainment LLC.</p>
                    <p className="text-sm text-muted-foreground">
                        Sviluppato da{" "}
                        <a
                            href="https://artiumviz.com"
                            className="underline hover:text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ArtiumViz
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

