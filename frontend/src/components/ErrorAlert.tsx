"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"

const ERROR_MESSAGES: Record<number, { title: string; description: string }> = {
  429: {
    title: "Troppe richieste",
    description: "Troppe richieste. Attendi qualche istante e riprova.",
  },
  422: {
    title: "Dati non validi",
    description: "Dati non validi. Controlla le date inserite.",
  },
  502: {
    title: "Servizio NASA non disponibile",
    description: "Il servizio NASA non è disponibile. Riprova più tardi.",
  },
  503: {
    title: "Servizio temporaneamente non disponibile",
    description: "Il servizio NASA non è disponibile. Riprova più tardi.",
  },
  404: {
    title: "Nessun dato trovato",
    description: "Nessun dato trovato per questa ricerca.",
  },
}

function parseErrorCode(message: string): number | null {
  const match = message.match(/(\d{3})/)
  return match ? Number.parseInt(match[1], 10) : null
}

function getErrorMessage(message: string): { title: string; description: string } {
  const code = parseErrorCode(message)

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code]
  }

  return {
    title: "Qualcosa è andato storto",
    description: message || "Qualcosa è andato storto. Riprova.",
  }
}

interface ErrorAlertProps {
  message: string
  onDismiss?: () => void
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  const { title, description } = getErrorMessage(message)

  return (
    <Alert variant="destructive" className="relative pr-10">
      <AlertCircle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-6 text-destructive-foreground/70 hover:text-destructive-foreground"
          onClick={onDismiss}
          aria-label="Chiudi alert"
        >
          <X className="size-4" />
        </Button>
      )}
    </Alert>
  )
}
