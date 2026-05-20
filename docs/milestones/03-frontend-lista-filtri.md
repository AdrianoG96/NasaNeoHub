# 📋 Milestone 3: Frontend — Lista Asteroidi con Filtri

> La vista principale: tabella interattiva di asteroidi.

---

## US-09: Tabella Asteroidi

**Come** utente,
**Voglio** vedere una lista di asteroidi in una tabella con nome, distanza, diametro, velocità, pericolosità,
**Così da** avere una panoramica chiara e veloce degli oggetti vicini alla Terra.

### Tasks
- [ ] Creare il componente `AsteroidTable` con Shadcn `<Table>`
- [ ] Colonne della tabella:
  - **Name** — nome dell'asteroide
  - **Min Distance (km)** — distanza minima di avvicinamento
  - **Diameter (km)** — diametro stimato (min – max)
  - **Velocity (km/h)** — velocità relativa
  - **Hazardous** — badge rosso "Yes" / badge verde "No"
- [ ] Formattare i numeri con separatore delle migliaia e decimali significativi
- [ ] Righe cliccabili che chiamano `onAsteroidClick(asteroidId)`

### Criteri di Accettazione
- [ ] La tabella si popola con i dati ricevuti dall'API
- [ ] I dati sono formattati correttamente (es. "1,234,567 km")
- [ ] Il badge Hazardous è rosso per `true`, verde per `false`

---

## US-10: Date Range Picker

**Come** utente,
**Voglio** un date picker per selezionare un range di date e caricare gli asteroidi,
**Così da** esplorare diversi periodi di osservazione.

### Tasks
- [ ] Creare il componente `DateRangeSelector` con:
  - Input "Start Date" (Shadcn Calendar/Popover)
  - Input "End Date" (Shadcn Calendar/Popover)
  - Bottone "Search" per avviare la ricerca
- [ ] Validazione lato frontend:
  - End date >= Start date
  - Range massimo configurabile (es. 30 giorni)
  - Date non future
- [ ] Stato di loading sul bottone durante il fetch
- [ ] Disabilitare il bottone se le date non sono valide

### Criteri di Accettazione
- [ ] L'utente può selezionare date con il calendario
- [ ] Date non valide mostrano un messaggio di errore
- [ ] Il bottone "Search" è disabilitato finché le date non sono valide

---

## US-11: Filtro Asteroidi Pericolosi

**Come** utente,
**Voglio** filtrare gli asteroidi per "pericolosi" / "non pericolosi" / "tutti",
**Così da** concentrarmi solo su quelli che mi interessano.

### Tasks
- [ ] Creare un filtro a tabs o dropdown sopra la tabella
- [ ] Opzioni: "All", "Hazardous Only", "Non-Hazardous Only"
- [ ] Il filtro è client-side (opera sui dati già caricati)
- [ ] Aggiornare il conteggio visibile: "Showing X of Y asteroids"

### Criteri di Accettazione
- [ ] Selezionando "Hazardous Only" si vedono solo gli asteroidi pericolosi
- [ ] Selezionando "All" si vede l'intera lista
- [ ] Il conteggio si aggiorna dinamicamente

---

## US-12: Ordinamento Colonne

**Come** utente,
**Voglio** ordinare la tabella per distanza o diametro (crescente/decrescente),
**Così da** trovare facilmente l'asteroide più vicino o più grande.

### Tasks
- [ ] Rendere le intestazioni delle colonne cliccabili per:
  - Min Distance
  - Diameter
  - Velocity
- [ ] Implementare ordinamento client-side (toggle asc/desc)
- [ ] Mostrare indicatore freccia (▲/▼) sulla colonna attiva
- [ ] Mantenere il filtro "Hazardous" attivo durante l'ordinamento

### Criteri di Accettazione
- [ ] Click su "Min Distance" ordina per distanza crescente
- [ ] Secondo click ordina per distanza decrescente
- [ ] L'indicatore mostra la direzione corrente

---

## US-13: Skeleton Loader

**Come** utente,
**Voglio** vedere uno skeleton loader mentre i dati vengono caricati,
**Così da** sapere che qualcosa sta succedendo e non vedere una pagina vuota.

### Tasks
- [ ] Creare componente `TableSkeleton` con Shadcn `<Skeleton>`
- [ ] Mostrare 5 righe placeholder con larghezze variabili
- [ ] Mostrare lo scheletro durante il fetch dei dati
- [ ] Sostituire con la tabella reale quando i dati arrivano

### Criteri di Accettazione
- [ ] Durante il caricamento, si vede lo skeleton e non la tabella vuota
- [ ] Lo skeleton ha un aspetto naturale (righe di diversa larghezza)
- [ ] Transizione fluida da skeleton a tabella
