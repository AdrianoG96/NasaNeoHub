# 🚀 NasaNeoHub

> **Dashboard interattiva per esplorare gli asteroidi in avvicinamento alla Terra usando dati reali della NASA.**

Backend Python **FastAPI** + Frontend **Next.js** — un proxy intelligente con caching verso la [NeoWs API](https://api.nasa.gov/) della NASA.

---

## ✨ Funzionalità Principali

| Funzionalità | Descrizione |
|---|---|
| **🔭 Proxy Backend con Caching** | Il frontend non chiama mai direttamente la NASA. Il backend fa da intermediario, parsifica e cache le risposte. |
| **📅 Range di Date Arbitrario** | L'API NASA accetta max 7 giorni per chiamata. Il backend spezza automaticamente range più lunghi in chunk, li esegue in sequenza e aggrega i risultati. |
| **📋 Tabella Asteroidi** | Nome, distanza minima (km), diametro stimato, velocità relativa, classificazione pericolosità. Filtrabile e ordinabile. |
| **⚠️ Filtro Asteroidi Pericolosi** | Mostra/nascondi solo gli asteroidi potenzialmente pericolosi. |
| **📊 Grafici Interattivi (Recharts)** | Distanza di avvicinamento nel tempo (scatter/line chart), distribuzione dimensioni (bar chart/histogram), e altre visualizzazioni. |
| **🔍 Scheda Dettaglio Asteroide** | Cliccando su un asteroide si apre una scheda con close approach storici, dati orbitali e link NASA JPL. |
| **🛡️ UX Robusta** | Skeleton loader, messaggi di errore chiari, stato vuoto, responsive design. |
| **🎨 Visualizzazioni Extra** | Grafico radar, donut chart pericolosità, heatmap attività, confronto asteroidi, visualizzazione orbitale 3D. |
| **📥 Esportazione CSV** | Scarica i dati degli asteroidi in formato CSV. |

---

## 🏗️ Architettura

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  NASA NeoWs  │
│  Next.js     │     │  FastAPI     │     │    API       │
│  :3000       │◀────│  :8000       │◀────│              │
└─────────────┘     └──────────────┘     └──────────────┘
                          │
                     ┌────▼────┐
                     │  Cache  │
                     └─────────┘
```

---

## 🚦 Avvio Rapido

### Prerequisiti

- Python 3.11+
- Node.js 18+
- Una chiave API NASA gratuita ([registrati qui](https://api.nasa.gov/))

### Variabili d'Ambiente

Crea un file `backend/.env`:

```env
NASA_API_KEY=la_tua_chiave
```

### Script di Avvio e Arresto

Il progetto include due script PowerShell per gestire facilmente i servizi:

| Comando | Descrizione |
|---|---|
| `.\start.ps1` | Avvia backend (FastAPI su `:8000`) e frontend (Next.js su `:3000`) |
| `.\stop.ps1` | Ferma tutti i servizi |

```powershell
# Avvia tutto
.\start.ps1

# Ferma tutto
.\stop.ps1
```

### Avvio Manuale

```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Frontend (in un altro terminale)
cd frontend
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

## 🗺️ Milestone di Sviluppo

| # | Milestone | Stato |
|---|---|---|
| 1 | [🏗️ Scaffolding e Setup](./milestones/01-scaffolding-e-setup.md) | ✅ |
| 2 | [🚀 Backend Core — Proxy con Caching](./milestones/02-backend-core-proxy-caching.md) | ✅ |
| 3 | [📋 Frontend — Lista Asteroidi con Filtri](./milestones/03-frontend-lista-filtri.md) | ✅ |
| 4 | [📊 Frontend — Grafici con Recharts](./milestones/04-frontend-grafici.md) | ✅ |
| 5 | [🔍 Frontend — Scheda Dettaglio Asteroide](./milestones/05-frontend-scheda-dettaglio.md) | ✅ |
| 6 | [🛡️ UX Robusta](./milestones/06-ux-robusta.md) | ✅ |
| 7 | [🌐 Deploy e CI/CD](./milestones/07-deploy-cicd.md) | ✅ |
| 8 | [🎯 Bonus: Miglioramenti](./milestones/08-bonus-miglioramenti.md) | ✅ |

---

## 🛠️ Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| **Backend** | Python, FastAPI, Uvicorn |
| **Frontend** | Next.js, TypeScript, TailwindCSS, Shadcn UI |
| **Grafici** | Recharts |
| **Deploy Backend** | Railway |
| **Deploy Frontend** | Vercel |

---

## 📚 Documentazione

- [Guida al Deploy](./DEPLOY.md)
- [Milestone di Sviluppo](./milestones/)

---

## 📄 Licenza

Progetto a scopo didattico. Dati forniti da [NASA NeoWs API](https://api.nasa.gov/).
