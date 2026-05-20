# 🔍 Milestone 5: Frontend — Scheda Dettaglio Asteroide

> Vista approfondita di un singolo asteroide.

---

## US-17: Apertura Scheda Dettaglio

**Come** utente,
**Voglio** che cliccando su un asteroide nella tabella si apra una scheda di dettaglio,
**Così da** vedere tutte le informazioni approfondite sull'oggetto selezionato.

### Tasks
- [ ] Creare il componente `AsteroidDetail` (Dialog modale o pagina `/neo/[id]`)
- [ ] Al click su una riga della tabella, chiamare `GET /api/neo/{id}`
- [ ] Mostrare nella scheda:
  - **Nome** (grande, in evidenza)
  - **ID** (secondario)
  - **Diametro stimato** (min/max in km e metri)
  - **Pericolosità** (badge + icona)
  - **Velocità relativa** (km/h)
  - **Distanza minima** (km)
  - **Data di avvicinamento**
  - **Link "View on NASA JPL"** (apre in nuova tab)
- [ ] Bottone "Close" per chiudere la scheda

### Criteri di Accettazione
- [ ] Click su riga apre la scheda con i dati dell'asteroide
- [ ] I dati sono caricati dall'endpoint di dettaglio
- [ ] Il link NASA JPL si apre in una nuova scheda

---

## US-18: Storico Close Approach

**Come** utente,
**Voglio** nella scheda dettaglio vedere lo storico dei close approach,
**Così da** capire quando e come l'asteroide si è avvicinato alla Terra in passato.

### Tasks
- [ ] Sezione "Close Approach History" nella scheda dettaglio
- [ ] Tabella con colonne:
  - **Date** — data dell'approccio
  - **Miss Distance (km)** — distanza minima
  - **Relative Velocity (km/h)** — velocità relativa
  - **Orbiting Body** — corpo orbitante (es. "Earth")
- [ ] Ordinamento per data (decrescente)
- [ ] Se ci sono molti record, mostrare i primi 10 con "Show more"

### Criteri di Accettazione
- [ ] La tabella mostra tutti i close approach storici
- [ ] I dati sono ordinati per data
- [ ] "Show more" espande la lista completa

---

## US-19: Dati Orbitali e Link NASA JPL

**Come** utente,
**Voglio** nella scheda dettaglio vedere i dati orbitali e un link alla pagina NASA JPL,
**Così da** approfondire le caratteristiche orbitali dell'asteroide.

### Tasks
- [ ] Sezione "Orbital Data" nella scheda dettaglio
- [ ] Mostrare:
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
- [ ] Formattare i numeri con 4 decimali significativi
- [ ] Bottone "🔗 View on NASA JPL" che apre `nasa_jpl_url`

### Criteri di Accettazione
- [ ] I dati orbitali sono visualizzati in modo leggibile
- [ ] Il link NASA JPL funziona e si apre in nuova tab
- [ ] I numeri sono formattati correttamente

---

## US-20: Loading e Errori nella Scheda Dettaglio

**Come** utente,
**Voglio** che la scheda dettaglio abbia il suo stato di loading e gestione errori,
**Così da** non rimanere con una schermata vuota o bloccata.

### Tasks
- [ ] Mostrare skeleton loader nella scheda mentre si caricano i dati
- [ ] Se l'ID non è valido o la chiamata fallisce, mostrare messaggio di errore
- [ ] Bottone "Retry" per riprovare la chiamata fallita
- [ ] Se l'asteroide non ha dati orbitali, mostrare "No orbital data available"

### Criteri di Accettazione
- [ ] Skeleton visibile durante il caricamento
- [ ] Errore mostrato con messaggio chiaro e bottone Retry
- [ ] Caso "no data" gestito senza crash
