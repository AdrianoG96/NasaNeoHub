# 🏗️ Milestone 1: Scaffolding e Setup Progetto

> Setup dell'infrastruttura base di backend e frontend.

---

## US-01: Inizializzazione Backend FastAPI

**Come** sviluppatore,
**Voglio** inizializzare il progetto backend FastAPI con struttura a moduli,
**Così da** avere una base solida e organizzata su cui sviluppare.

### Tasks
- [x] Creare la struttura `backend/` con i seguenti moduli:
  - `app/main.py` — entry point dell'applicazione
  - `app/core/` — configurazioni, dipendenze, settings
  - `app/routers/` — endpoint API
  - `app/schemas/` — modelli Pydantic (request/response)
  - `app/services/` — logica di business (chiamate NASA, caching)
- [x] Setup di `requirements.txt` con:
  - `fastapi`
  - `uvicorn[standard]`
  - `httpx` (chiamate HTTP asincrone alla NASA)
  - `pydantic` (già incluso in FastAPI)
  - `python-dotenv` (variabili d'ambiente)
  - `aiocache` (caching)
- [x] Configurare un `main.py` minimale con FastAPI app e health check endpoint (`GET /health`)

### Criteri di Accettazione
- [x] Il server parte con `uvicorn app.main:app --reload`
- [x] `GET /health` restituisce `{"status": "ok"}`
- [x] La struttura a moduli è rispettata

---

## US-02: Inizializzazione Frontend Next.js

**Come** sviluppatore,
**Voglio** inizializzare il progetto frontend Next.js con TypeScript e Shadcn UI,
**Così da** avere un frontend moderno e componenti riutilizzabili.

### Tasks
- [x] Eseguire `npx create-next-app@latest frontend/` con:
  - TypeScript
  - App Router
  - TailwindCSS
  - ESLint
- [x] Inizializzare Shadcn UI:
  - `npx shadcn@latest init`
  - Configurare con base color (neutral/zinc)
- [x] Aggiungere componenti Shadcn base:
  - `Button`
  - `Card`
  - `Table`
  - `Dialog`
  - `Skeleton`
  - `Badge`
  - `Alert`
  - `DatePicker` (o `Popover` + `Calendar`)
- [x] Verificare che il progetto compili e sia visibile su `localhost:3000`

### Criteri di Accettazione
- [x] `npm run dev` parte senza errori
- [x] I componenti Shadcn sono importabili e funzionanti
- [x] TailwindCSS è configurato correttamente

---

## US-03: Configurazione Variabili d'Ambiente

**Come** sviluppatore,
**Voglio** configurare le variabili d'ambiente per NASA API key e URL del backend,
**Così da** non hardcodare credenziali e configurazioni nel codice.

### Tasks
- [x] Backend: creare `.env.example` con:
  ```env
  NASA_API_KEY=DEMO_KEY
  CACHE_TTL=3600
  ```
- [x] Backend: creare `app/core/config.py` con Pydantic `BaseSettings`
- [x] Frontend: creare `.env.example` con:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
- [x] Aggiungere `.env` a `.gitignore` (entrambi i progetti)

### Criteri di Accettazione
- [x] Le variabili d'ambiente sono caricate correttamente
- [x] `.env` non è tracciato da git
- [x] La configurazione è tipizzata con Pydantic
