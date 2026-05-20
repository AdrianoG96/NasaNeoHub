"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="size-5 text-green-400" />,
  error: <AlertCircle className="size-5 text-red-400" />,
  info: <Info className="size-5 text-blue-400" />,
  warning: <AlertTriangle className="size-5 text-yellow-400" />,
}

const BORDER_COLORS: Record<ToastType, string> = {
  success: "border-green-500/30",
  error: "border-red-500/30",
  info: "border-blue-500/30",
  warning: "border-yellow-500/30",
}

const BG_COLORS: Record<ToastType, string> = {
  success: "bg-green-500/10",
  error: "bg-red-500/10",
  info: "bg-blue-500/10",
  warning: "bg-yellow-500/10",
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      setToasts((prev) => [...prev, { ...toast, id }])

      const timer = setTimeout(() => {
        removeToast(id)
      }, 5000)
      timersRef.current.set(id, timer)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-scale-in flex w-80 items-start gap-3 rounded-lg border ${BORDER_COLORS[toast.type]} ${BG_COLORS[toast.type]} p-4 shadow-lg backdrop-blur-sm`}
            role="alert"
          >
            <div className="mt-0.5 shrink-0">{ICONS[toast.type]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-xs text-white/60">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
