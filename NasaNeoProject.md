Costruisci una dashboard completa per esplorare gli asteroidi in avvicinamento alla Terra: dati reali della NASA, backend Python FastAPI, frontend Next.js. Nessun tutorial passo-passo. Solo tu, la documentazione, e le dita sulla tastiera.

Il contesto
Il Centro di Studi degli Oggetti Vicini alla Terra della NASA traccia ogni asteroide che passa nel vicinato del Sistema Solare. I dati sono pubblici, aggiornati quotidianamente, e accessibili via API. La stessa API che usano i ricercatori veri.

Il tuo compito: costruire uno strumento che trasformi quei dati grezzi in qualcosa di leggibile, esplorabile, utile. Un backend Python FastAPI che fa da proxy intelligente e gestisce il caching? Un frontend Next.js che visualizza, filtra, racconta?

Non esiste una soluzione unica. Esistono scelte di design, di stack, scelte di architettura, scelte di trade-off. Le tue.

Libertà totale: potete estendere, reinterpretare, sperimentare e aggiungere le vostre idee. Anzi, un po’ di creatività è più che ben accetta.

 Lo stack
🟢​ Questa è la traccia consigliata, se vuoi sperimentare con altre tecnologie, framework o approcci che ti incuriosiscono, fallo pure: l’importante è che il progetto resti solido, completo e raccontabile..

Backend: Python + FastAPI
Endpoint API propri, gestione della chiave NASA, caching lato server e logica di business.

Frontend: Next.js + Shadcn UI
App React moderna, routing, componenti riutilizzabili e consumo dei tuoi endpoint FastAPI.

 

Visualizzazione: Recharts
Grafici per distanza nel tempo, dimensioni e classificazione di rischio. I dati crudi sono noiosi, i grafici raccontano storie.

 

Deploy: A tua scelta
Backend su Railway, Render o Fly.io. Frontend su Vercel, Netlify o soluzione equivalente. Il progetto deve essere online.

 

L'API NASA
 

Userai la NeoWs API (Near Earth Object Web Service). Documentazione ufficiale: api.nasa.gov

# Endpoint principale
GET https://api.nasa.gov/neo/rest/v1/feed

# Parametri richiesti
start_date=2024-01-01      # inizio periodo
end_date=2024-01-07        # max 7 giorni per chiamata
api_key=DEMO_KEY            # o la tua chiave personale

# Endpoint singolo asteroide
GET https://api.nasa.gov/neo/rest/v1/neo/{id}

Rate limit DEMO_KEY: 30 richieste/ora, 50 richieste/giorno. È un limite severo, ma è il punto. Uno dei requisiti di questa challenge è gestirlo con intelligenza lato backend.Ti consigliamo di registrarti per una chiave personale gratuita su api.nasa.gov (la registrazione è rapida): avrai 1.000 richieste/ora. Ma anche con la tua chiave personale i limiti esistono e il tuo backend deve rispettarli.

Cosa deve fare

01. Proxy backend con caching

Il frontend non chiama mai direttamente la NASA. Chiama i tuoi endpoint FastAPI. Il backend fa da intermediario, salva le risposte in cache (usa quello che vuoi: FastAPI cache framework, Redis, anche file-based), e serve i dati già parsati. Se lo stesso range di date viene richiesto due volte, NASA non viene chiamata la seconda volta.

02. Lista asteroidi con filtri

Mostra nome, distanza minima in km, diametro stimato (min/max), velocità relativa, e se è classificato "potenzialmente pericoloso" (campo is_potentially_hazardous_asteroid). L'utente deve poter filtrare per pericolosi/non pericolosi e ordinare per distanza o dimensione.

03. Range di date arbitrario

L'API NASA accetta massimo 7 giorni per chiamata. Il tuo backend deve gestire range più lunghi automaticamente: spezza la richiesta in chunk da 7 giorni, esegui le chiamate in sequenza, aggrega i risultati. Il frontend fa una sola richiesta, il backend fa il lavoro sporco.

04. Grafici con Recharts

Almeno due visualizzazioni: distanza di avvicinamento nel tempo (scatter o line chart), e distribuzione delle dimensioni (histogram o bar chart). I dati grezzi in JSON sono informativi, i grafici sono comprensibili.

05. Scheda dettaglio asteroide

Cliccando su un asteroide, mostra una scheda con tutti i dati disponibili: close approach data storici, link alla pagina NASA JPL, orbital data. Questo richiede una seconda chiamata all'endpoint /neo/{id}. Anche questa deve passare per il tuo backend con caching.

06. UX robusta: loading, errori, edge case

Skeleton loader mentre arrivano i dati. Messaggi di errore chiari (rate limit raggiunto, range troppo lungo, data non valida). Gestione del caso "zero asteroidi trovati". Una buona UX non è solo bella, è robusta.

07. Deploy completo e funzionante

Backend su un hosting reale (Railway, Render, Fly.io). Frontend su Vercel o GitHub Pages. Le variabili d'ambiente (API key NASA) non vanno nel codice, nei secrets del servizio di deploy. Il progetto non esiste se non è online.