# 🔍 Milestone 5: Frontend — Scheda Dettaglio Asteroide

> Vista approfondita di un singolo asteroide.

---

## US-17: Apertura Scheda Dettaglio

**Come** utente,
**Voglio** che cliccando su un asteroide nella tabella si apra una scheda di dettaglio,
**Così da** vedere tutte le informazioni approfondite sull'oggetto selezionato.

### Tasks
- [x] Creare il componente `AsteroidDetail` (Dialog modale)
- [x] Al click su una riga della tabella, chiamare `GET /api/neo/{id}`
- [x] Mostrare nella scheda:
  - **Nome** (grande, in evidenza)
  - **ID** (secondario)
  - **Diametro stimato** (min/max in km e metri)
  - **Pericolosità** (badge + icona)
  - **Velocità relativa** (km/h)
  - **Distanza minima** (km)
  - **Data di avvicinamento**
  - **Link "View on NASA JPL"** (apre in nuova tab)
- [x] Bottone "Close" per chiudere la scheda

### Criteri di Accettazione
- [x] Click su riga apre la scheda con i dati dell'asteroide
- [x] I dati sono caricati dall'endpoint di dettaglio
- [x] Il link NASA JPL si apre in una nuova scheda

---

## US-18: Storico Close Approach

**Come** utente,
**Voglio** nella scheda dettaglio vedere lo storico dei close approach,
**Così da** capire quando e come l'asteroide si è avvicinato alla Terra in passato.

### Tasks
- [x] Sezione "Close Approach History" nella scheda dettaglio
- [x] Tabella con colonne:
  - **Date** — data dell'approccio
  - **Miss Distance (km)** — distanza minima
  - **Relative Velocity (km/h)** — velocità relativa
  - **Orbiting Body** — corpo orbitante (es. "Earth")
- [x] Ordinamento per data (decrescente)
- [x] Se ci sono molti record, mostrare i primi 10 con "Show more"

### Criteri di Accettazione
- [x] La tabella mostra tutti i close approach storici
- [x] I dati sono ordinati per data
- [x] "Show more" espande la lista completa

---

## US-19: Dati Orbitali e Link NASA JPL

**Come** utente,
**Voglio** nella scheda dettaglio vedere i dati orbitali e un link alla pagina NASA JPL,
**Così da** approfondire le caratteristiche orbitali dell'asteroide.

### Tasks
- [x] Sezione "Orbital Data" nella scheda dettaglio
- [x] Mostrare:
  - **Orbit ID**
  - **Orbit Determination Date**
  - **Eccentricity**
  - **Semi-Major Axis (AU)**
  - **Inclination (deg)**
  - **Ascending Node Longitude (deg)**
  - **Perihelion Distance (AU)**
  - **Aphelion Distance (AU)**
  - **Orbital Period (days)**
  - **Minimum Orbit Intersection Distance (AU)**
- [x] Formattare i numeri con 4 decimali significativi
- [x] Bottone "🔗 View on NASA JPL" che apre `nasa_jpl_url`

### Criteri di Accettazione
- [x] I dati orbitali sono visualizzati in modo leggibile
- [x] Il link NASA JPL funziona e si apre in nuova tab
- [x] I numeri sono formattati correttamente

---

## US-20: Loading e Errori nella Scheda Dettaglio

**Come** utente,
**Voglio** che la scheda dettaglio abbia il suo stato di loading e gestione errori,
**Così da** non rimanere con una schermata vuota o bloccata.

### Tasks
- [x] Mostrare skeleton loader nella scheda mentre si caricano i dati
- [x] Se l'ID non è valido o la chiamata fallisce, mostrare messaggio di errore
- [x] Bottone "Retry" per riprovare la chiamata fallita
- [x] Se l'asteroide non ha dati orbitali, mostrare "No orbital data available"

### Criteri di Accettazione
- [x] Skeleton visibile durante il caricamento
- [x] Errore mostrato con messaggio chiaro e bottone Retry
- [x] Caso "no data" gestito senza crash
