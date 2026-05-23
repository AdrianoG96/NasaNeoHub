# 🚀 Guida al Deploy

> Istruzioni passo-passo per deployare **NasaNeoHub**:
> - **Backend** → [Railway](https://railway.com)
> - **Frontend** → [Vercel](https://vercel.com)

---

## Indice

1. [Prerequisiti](#1-prerequisiti)
2. [Deploy Backend su Railway](#2-deploy-backend-su-railway)
3. [Deploy Frontend su Vercel](#3-deploy-frontend-su-vercel)
4. [Verifica Finale](#4-verifica-finale)
5. [Deploy Automatico (CI/CD)](#5-deploy-automatico-cicd)

---

## 1. Prerequisiti

- **GitHub** account con il repository `NasaNeoHub` già pushato
- **Railway** account (gratuito, [railway.com](https://railway.com))
- **Vercel** account (gratuito, [vercel.com](https://vercel.com))
- **NASA API Key** (gratuita, [api.nasa.gov](https://api.nasa.gov)) — se non l'hai già, registrati e ottieni una chiave

---

## 2. Deploy Backend su Railway

### 2.1 — Crea il Dockerfile

Railway supporta il deploy diretto da repository. Per sicurezza, creiamo un `Dockerfile` nella cartella `backend/`.

Crea il file `backend/Dockerfile`:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Installa dipendenze
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il codice
COPY . .

# Esponi la porta
EXPOSE 8000

# Comando di avvio
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2.2 — Crea il file `railway.json` (opzionale ma consigliato)

Crea `backend/railway.json` per configurare il build command:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.3 — Push su GitHub

Assicurati che i file siano committati e pushati:

```bash
git add backend/Dockerfile backend/railway.json
git commit -m "feat: add Dockerfile and railway config for backend deploy"
git push
```

### 2.4 — Collega Railway al Repository

1. Vai su [railway.com/dashboard](https://railway.com/dashboard)
2. Clicca **"New Project"** → **"Deploy from GitHub repo"**
3. Seleziona il repository `AdrianoG96/NasaNeoHub`
4. Railway rileverà automaticamente il `Dockerfile` nella root del progetto

   ⚠️ **Attenzione**: Railway usa la root del repo come contesto di build. Dobbiamo dirgli di usare la cartella `backend/`.

5. Dopo aver creato il progetto, vai su **Settings** → **Root Directory** e imposta `backend`
6. Railway ora builda e deploya automaticamente

### 2.5 — Configura le Variabili d'Ambiente

1. Nel progetto Railway, vai su **Variables**
2. Aggiungi le seguenti variabili:

| Variabile       | Valore                                | Obbligatoria |
|-----------------|---------------------------------------|--------------|
| `NASA_API_KEY`  | La tua chiave presa da api.nasa.gov   | ✅           |
| `CACHE_TTL`     | `3600` (default, puoi cambiarlo)      | ❌           |

3. Railway le inietterà automaticamente nel container

### 2.6 — Ottieni l'URL Pubblico

1. Railway assegna automaticamente un dominio del tipo `https://nasaneohub-production-xxxx.up.railway.app`
2. Vai su **Settings** → **Networking** per vedere il dominio generato
3. (Opzionale) Puoi configurare un dominio personalizzato sempre in **Settings** → **Domains**

### 2.7 — Verifica il Backend

Apri il browser e testa:

```
GET https://tuo-backend.up.railway.app/health
```

Dovresti ricevere:

```json
{ "status": "ok" }
```

Poi testa un endpoint API:

```
GET https://tuo-backend.up.railway.app/api/neo/feed?start_date=2026-05-20&end_date=2026-05-23
```

---

## 3. Deploy Frontend su Vercel

### 3.1 — Prepara il Frontend

Il frontend è già configurato per Next.js. Non serve alcun Dockerfile — Vercel lo builda nativamente.

#### Crea il file `vercel.json`

Crea il file `frontend/vercel.json` per configurare esplicitamente il framework:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

> **Nota**: Questo file è necessario per progetti monorepo dove la root del frontend non coincide con la root del repository. Senza di esso, Vercel potrebbe non riconoscere correttamente il framework e restituire 404.

### 3.2 — Collega Vercel al Repository

1. Vai su [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clicca **"Add New..."** → **"Project"**
3. Seleziona il repository `AdrianoG96/NasaNeoHub`
4. Nella configurazione del progetto:

   - **Framework Preset**: Next.js (Vercel lo rileva automaticamente)
   - **Root Directory**: `frontend` ← **IMPORTANTE!** (usa il dropdown per selezionarla)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3.3 — Configura la Variabile d'Ambiente

Sempre nella schermata di configurazione (o dopo in **Settings** → **Environment Variables**):

| Variabile               | Valore                                                | Obbligatoria |
|-------------------------|-------------------------------------------------------|--------------|
| `NEXT_PUBLIC_API_URL`   | `https://tuo-backend.up.railway.app` (URL del backend) | ✅           |

> **Nota**: `NEXT_PUBLIC_` è il prefisso che Next.js usa per esporre le variabili d'ambiente anche al client-side.

### 3.4 — Deploy!

1. Clicca **"Deploy"**
2. Vercel builda il progetto e lo pubblica automaticamente
3. Dopo qualche minuto, il frontend sarà live su un dominio del tipo `https://nasaneohub.vercel.app`

### 3.5 — Verifica il Frontend

1. Apri l'URL del frontend
2. La dashboard dovrebbe caricare e mostrare i dati degli asteroidi provenienti dal backend su Railway
3. Se vedi errori di CORS o connessione, controlla che:
   - Il backend su Railway sia raggiungibile
   - La variabile `NEXT_PUBLIC_API_URL` sia corretta (senza slash finale)
   - Il backend abbia CORS configurato (lo abbiamo già con `allow_origins=["*"]`)

---

## 4. Verifica Finale

Dopo aver completato entrambi i deploy, verifica che tutto funzioni:

1. ✅ **Backend**: `GET /health` risponde `{"status": "ok"}`
2. ✅ **Backend**: `GET /api/neo/feed?start_date=...&end_date=...` restituisce dati
3. ✅ **Frontend**: La dashboard si carica e mostra i dati
4. ✅ **Frontend**: I filtri e le ricerche funzionano
5. ✅ **Frontend**: I dettagli degli asteroidi sono accessibili

---

## 5. Deploy Automatico (CI/CD)

Entrambe le piattaforme supportano il deploy automatico:

### Railway (Backend)

- **Trigger**: Ogni push su `main` (o sul branch che hai configurato)
- **Come funziona**: Railway rebuild automaticamente il container quando rileva cambiamenti nel branch collegato
- **Configurazione**: Vai su **Settings** → **GitHub Repo** → scegli il branch (es. `main`)

### Vercel (Frontend)

- **Trigger**: Ogni push su `main` (o sul branch che hai configurato)
- **Come funziona**: Vercel rebuild automaticamente il progetto quando rileva cambiamenti
- **Configurazione**: Vai su **Settings** → **Git** → **Production Branch** (es. `main`)
- **Preview Deploy**: Vercel crea automaticamente URL di preview per ogni PR

### Workflow Consigliato

1. Lavora su branch feature (`feat/...`, `fix/...`)
2. Fai una Pull Request su `main`
3. Vercel crea una preview URL per testare il frontend
4. Dopo il merge su `main`, entrambi i deploy si aggiornano automaticamente

---

## Troubleshooting

| Problema | Causa Probabile | Soluzione |
|----------|----------------|-----------|
| Backend non risponde | Variabili d'ambiente mancanti | Controlla che `NASA_API_KEY` sia impostata in Railway |
| Frontend non carica dati | `NEXT_PUBLIC_API_URL` errata | Verifica l'URL del backend (senza slash finale) |
| CORS error | Backend non accetta richieste dal dominio frontend | Il backend ha già `allow_origins=["*"]`, dovrebbe funzionare |
| Build fallisce su Railway | Root directory non configurata | Imposta `backend` come Root Directory in Railway Settings |
| Build fallisce su Vercel | Root directory non configurata | Imposta `frontend` come Root Directory in Vercel |
| `DEMO_KEY` rate limit | Hai lasciato `NASA_API_KEY=DEMO_KEY` | Sostituisci con una chiave reale da api.nasa.gov |

---

## Riepilogo URL

| Servizio   | Piattaforma | URL (esempio)                              |
|------------|-------------|--------------------------------------------|
| Backend    | Railway     | `https://nasaneohub-production.up.railway.app` |
| Frontend   | Vercel      | `https://nasaneohub.vercel.app`            |
| Repository | GitHub      | `https://github.com/AdrianoG96/NasaNeoHub` |
