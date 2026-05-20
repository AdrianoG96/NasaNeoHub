# 📋 Milestone 3: Frontend — Lista Asteroidi con Filtri

> La vista principale: tabella interattiva di asteroidi.

---

## US-09: Tabella Asteroidi

**Come** utente,
**Voglio** vedere una lista di asteroidi in una tabella con nome, distanza, diametro, velocità, pericolosità,
**Così da** avere una panoramica chiara e veloce degli oggetti vicini alla Terra.

### Tasks
- [x] Creare il componente `AsteroidTable` con Shadcn `<Table>`
- [x] Colonne della tabella:
  - **Name** — nome dell'asteroide
  - **Min Distance (km)** — distanza minima di avvicinamento
  - **Diameter (km)** — diametro stimato (min – max)
  - **Velocity (km/h)** — velocità relativa
  - **Hazardous** — badge rosso "Yes" / badge verde "No"
- [x] Formattare i numeri con separatore delle migliaia e decimali significativi
- [x] Righe cliccabili che chiamano `onAsteroidClick(asteroidId)`

### Criteri di Accettazione
- [x] La tabella si popola con i dati ricevuti dall'API
- [x] I dati sono formattati correttamente (es. "1,234,567 km")
- [x] Il badge Hazardous è rosso per `true`, verde per `false`

---

## US-10: Date Range Picker

**Come** utente,
**Voglio** un date picker per selezionare un range di date e caricare gli asteroidi,
**Così da** esplorare diversi periodi di osservazione.

### Tasks
- [x] Creare il componente `DateRangeSelector` con:
  - Input "Start Date" (Shadcn Calendar/Popover)
  - Input "End Date" (Shadcn Calendar/Popover)
  - Bottone "Search" per avviare la ricerca
- [x] Validazione lato frontend:
  - End date >= Start date
  - Range massimo configurabile (es. 30 giorni)
  - Date non future
- [x] Stato di loading sul bottone durante il fetch
- [x] Disabilitare il bottone se le date non sono valide

### Criteri di Accettazione
- [x] L'utente può selezionare date con il calendario
- [x] Date non valide mostrano un messaggio di errore
- [x] Il bottone "Search" è disabilitato finché le date non sono valide

---

## US-11: Filtro Asteroidi Pericolosi

**Come** utente,
**Voglio** filtrare gli asteroidi per "pericolosi" / "non pericolosi" / "tutti",
**Così da** concentrarmi solo su quelli che mi interessano.

### Tasks
- [x] Creare un filtro a tabs o dropdown sopra la tabella
- [x] Opzioni: "All", "Hazardous Only", "Non-Hazardous Only"
- [x] Il filtro è client-side (opera sui dati già caricati)
- [x] Aggiornare il conteggio visibile: "Showing X of Y asteroids"

### Criteri di Accettazione
- [x] Selezionando "Hazardous Only" si vedono solo gli asteroidi pericolosi
- [x] Selezionando "All" si vede l'intera lista
- [x] Il conteggio si aggiorna dinamicamente

---

## US-12: Ordinamento Colonne

**Come** utente,
**Voglio** ordinare la tabella per distanza o diametro (crescente/decrescente),
**Così da** trovare facilmente l'asteroide più vicino o più grande.

### Tasks
- [x] Rendere le intestazioni delle colonne cliccabili per:
  - Min Distance
  - Diameter
  - Velocity
- [x] Implementare ordinamento client-side (toggle asc/desc)
- [x] Mostrare indicatore freccia (▲/▼) sulla colonna attiva
- [x] Mantenere il filtro "Hazardous" attivo durante l'ordinamento

### Criteri di Accettazione
- [x] Click su "Min Distance" ordina per distanza crescente
- [x] Secondo click ordina per distanza decrescente
- [x] L'indicatore mostra la direzione corrente

---

## US-13: Skeleton Loader

**Come** utente,
**Voglio** vedere uno skeleton loader mentre i dati vengono caricati,
**Così da** sapere che qualcosa sta succedendo e non vedere una pagina vuota.

### Tasks
- [x] Creare componente `TableSkeleton` con Shadcn `<Skeleton>`
- [x] Mostrare 5 righe placeholder con larghezze variabili
- [x] Mostrare lo scheletro durante il fetch dei dati
- [x] Sostituire con la tabella reale quando i dati arrivano

### Criteri di Accettazione
- [x] Durante il caricamento, si vede lo skeleton e non la tabella vuota
- [x] Lo skeleton ha un aspetto naturale (righe di diversa larghezza)
- [x] Transizione fluida da skeleton a tabella
