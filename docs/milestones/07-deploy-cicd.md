# 🌐 Milestone 7: Deploy e CI/CD

> Il progetto va online.

---

## US-24: Deploy Backend

**Come** sviluppatore,
**Voglio** deployare il backend su Railway/Render/Fly.io con variabili d'ambiente configurate,
**Così da** rendere l'API accessibile pubblicamente.

### Tasks
- [ ] Scegliere piattaforma di hosting (Railway consigliato per semplicità)
- [ ] Creare `Dockerfile` o `Procfile` per il backend:
  ```dockerfile
  FROM python:3.12-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install -r requirements.txt
  COPY . .
  CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```
- [ ] Configurare variabili d'ambiente nel servizio:
  - `NASA_API_KEY` (chiave personale registrata su api.nasa.gov)
  - `CACHE_TTL` (es. 3600)
- [ ] Configurare dominio o URL pubblico
- [ ] Verificare che `GET /health` risponda dall'URL pubblico

### Criteri di Accettazione
- [ ] Backend raggiungibile da URL pubblico
- [ ] `GET /api/neo/feed` funziona dall'URL pubblico
- [ ] Variabili d'ambiente configurate come secrets, non in codice

---

## US-25: Deploy Frontend

**Come** sviluppatore,
**Voglio** deployare il frontend su Vercel con `NEXT_PUBLIC_API_URL` configurato,
**Così da** rendere la dashboard accessibile a chiunque.

### Tasks
- [ ] Collegare repository GitHub a Vercel
- [ ] Configurare variabile d'ambiente:
  - `NEXT_PUBLIC_API_URL` = URL del backend deployato
- [ ] Configurare build command: `npm run build`
- [ ] Configurare output directory: `.next`
- [ ] Abilitare deploy automatico su push su branch `main`
- [ ] Verificare che il frontend carichi e visualizzi dati dal backend live

### Criteri di Accettazione
- [ ] Frontend raggiungibile da URL pubblico (es. nasa-neo-hub.vercel.app)
- [ ] La dashboard carica dati dal backend deployato
- [ ] Deploy automatico funziona su push

---

## US-26: README.md Completo

**Come** sviluppatore,
**Voglio** un README.md completo con: descrizione, setup locale, variabili d'ambiente, link al deploy,
**Così da** permettere ad altri sviluppatori di capire e contribuire al progetto.

### Tasks
- [ ] Creare `README.md` nella root del progetto con:
  - **Titolo e descrizione** del progetto
  - **Screenshot** della dashboard (opzionale ma consigliato)
  - **Tech Stack** (FastAPI, Next.js, Shadcn, Recharts)
  - **Prerequisiti** (Python 3.12+, Node.js 20+)
  - **Setup Locale Backend**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env  # configura NASA_API_KEY
    uvicorn app.main:app --reload
    ```
  - **Setup Locale Frontend**:
    ```bash
    cd frontend
    npm install
    cp .env.example .env.local  # configura NEXT_PUBLIC_API_URL
    npm run dev
    ```
  - **Variabili d'Ambiente** (tabella con nome, descrizione, default)
  - **Struttura del Progetto** (albero delle directory)
  - **API Endpoints** (tabella con metodo, path, descrizione)
  - **Deploy** (link al backend live e frontend live)
  - **Licenza**

### Criteri di Accettazione
- [ ] README.md completo e ben formattato
- [ ] Istruzioni di setup funzionanti (testate)
- [ ] Link al deploy funzionanti
