# 🚀 Milestone 2: Backend Core — Proxy con Caching

> Il cuore del backend: proxy intelligente verso NASA API.

---

## US-04: Endpoint Feed Asteroidi

**Come** utente,
**Voglio** che il backend esponga un endpoint `GET /api/neo/feed?start_date=&end_date=`,
**Così da** ottenere la lista degli asteroidi in un range di date.

### Tasks
- [x] Creare router `app/routers/neo.py` con endpoint `GET /api/neo/feed`
- [x] Validare i parametri `start_date` e `end_date` (formato YYYY-MM-DD, date valide)
- [x] Chiamare la NASA NeoWs `/feed` con `httpx.AsyncClient`
- [x] Parsificare la risposta NASA e mapparla in un modello Pydantic con:
  - `name`
  - `estimated_diameter_min_km`
  - `estimated_diameter_max_km`
  - `close_approach_date`
  - `miss_distance_km`
  - `relative_velocity_kph`
  - `is_potentially_hazardous_asteroid`
  - `nasa_jpl_url`
  - `id`
- [x] Restituire una lista ordinata per data di avvicinamento

### Criteri di Accettazione
- [x] `GET /api/neo/feed?start_date=2024-01-01&end_date=2024-01-07` restituisce JSON con array di asteroidi
- [x] Ogni asteroide ha tutti i campi richiesti
- [x] Parametri mancanti o non validi restituiscono errore 422

---

## US-05: Gestione Range di Date Arbitrari

**Come** utente,
**Voglio** che il backend gestisca range di date arbitrari (>7 giorni) spezzandoli in chunk,
**Così da** poter richiedere periodi più lunghi senza preoccuparmi del limite NASA.

### Tasks
- [x] Implementare logica in `services/nasa_service.py` che:
  - Calcola la differenza in giorni tra `start_date` e `end_date`
  - Se > 7 giorni, divide in sotto-range di max 7 giorni
  - Esegue chiamate sequenziali per ogni sotto-range
  - Aggrega e deduplica i risultati (stesso asteroide può apparire in più giorni)
- [x] Gestire il caso limite: range di 0 giorni (start == end)
- [x] Gestire il caso limite: range negativo (start > end) → errore 422

### Criteri di Accettazione
- [x] `GET /api/neo/feed?start_date=2024-01-01&end_date=2024-01-21` funziona e restituisce dati aggregati
- [x] Asteroidi duplicati tra chunk sono deduplicati (stesso `id`)
- [x] Range negativo restituisce errore 422 con messaggio chiaro

---

## US-06: Caching delle Risposte

**Come** utente,
**Voglio** che il backend faccia caching delle risposte per evitare chiamate ripetute alla NASA,
**Così da** avere risposte più veloci e non consumare il rate limit.

### Tasks
- [x] Integrare `aiocache` con backend in-memory
- [x] Cacheare la funzione `fetch_feed` con chiave basata su `start_date` + `end_date`
- [x] Cacheare la funzione `fetch_asteroid_detail` con chiave basata su `id`
- [x] Configurare TTL (time-to-live) da variabile d'ambiente `CACHE_TTL` (default: 3600s = 1 ora)
- [x] Se la cache è valida, restituire i dati cached senza chiamare NASA

### Criteri di Accettazione
- [x] Prima chiamata: va a NASA (lenta), seconda chiamata stesso range: torna da cache (veloce)
- [x] La cache si invalida dopo il TTL configurato
- [x] Il caching funziona anche per l'endpoint di dettaglio

---

## US-07: Endpoint Dettaglio Asteroide

**Come** utente,
**Voglio** un endpoint `GET /api/neo/{id}` per i dettagli di un singolo asteroide,
**Così da** vedere tutte le informazioni disponibili.

### Tasks
- [x] Aggiungere endpoint `GET /api/neo/{id}` nel router `neo.py`
- [x] Chiamare NASA `/neo/{id}` con `httpx.AsyncClient`
- [x] Restituire tutti i dati parsificati:
  - `id`, `name`, `nasa_jpl_url`
  - `estimated_diameter` (min/max in km, meters, miles, feet)
  - `is_potentially_hazardous_asteroid`
  - `close_approach_data` (array storico di tutti gli approcci)
  - `orbital_data` (orbita, eccentricità, inclinazione, periodo, etc.)
- [x] Applicare caching anche a questo endpoint

### Criteri di Accettazione
- [x] `GET /api/neo/{valid_id}` restituisce tutti i dati dell'asteroide
- [x] `GET /api/neo/{invalid_id}` restituisce 404
- [x] I dati includono `close_approach_data` e `orbital_data`

---

## US-08: Gestione Errori NASA

**Come** utente,
**Voglio** che il backend gestisca gli errori NASA (rate limit, 404, 500) con messaggi chiari,
**Così da** capire cosa è successo senza vedere errori tecnici criptici.

### Tasks
- [x] Gestire `HTTPStatus 429` (rate limit) dalla NASA:
  - Restituire 429 con messaggio: "Rate limit NASA raggiunto. Riprova più tardi."
- [x] Gestire `HTTPStatus 404` dalla NASA:
  - Restituire 404 con messaggio: "Asteroide non trovato."
- [x] Gestire `HTTPStatus 500+` dalla NASA:
  - Restituire 502 con messaggio: "Errore dal servizio NASA. Riprova più tardi."
- [x] Gestire timeout e errori di connessione:
  - Restituire 503 con messaggio: "Servizio temporaneamente non disponibile."
- [x] Loggare tutti gli errori con `logging` per debugging

### Criteri di Accettazione
- [x] Ogni errore NASA è tradotto in un errore HTTP appropriato con messaggio user-friendly
- [x] Gli errori sono loggati lato server
- [x] La response ha sempre un campo `detail` leggibile
