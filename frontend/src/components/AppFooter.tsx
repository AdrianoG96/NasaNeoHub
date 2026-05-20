import { ExternalLink } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6">
        {/* Left: Credits */}
        <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
              <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              Powered by NASA APIs
            </span>
          </div>
          <p className="text-xs text-white/40">
            Data provided by{" "}
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400/70 underline-offset-2 hover:underline hover:text-blue-300"
            >
              NASA Open APIs
            </a>
            {" "}— Near Earth Object Web Service
          </p>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://cneos.jpl.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <ExternalLink className="size-3" />
            CNEOS
          </a>
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <ExternalLink className="size-3" />
            API Docs
          </a>
          <span className="text-xs text-white/20">|</span>
          <span className="text-xs text-white/30 font-mono">v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
