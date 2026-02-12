export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with <span className="text-burnt-peach">♥</span> by{" "}
          <span className="font-medium underline underline-offset-4 text-charcoal-blue dark:text-verdigris">Faheem</span>.
          The source code is available on{" "}
          <a
            href="https://github.com/Start-app/Portfolio"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 text-tuscan-sun"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
