# 🎯 Milestone 8 (Bonus): Miglioramenti e Creatività

> Oltre i requisiti base — idee per distinguersi.

---

## US-27 (Bonus): Dashboard Riassuntiva

**Come** utente,
**Voglio** vedere una dashboard riassuntiva con statistiche: totale asteroidi, media distanza, più pericoloso, più grande,
**Così da** avere un colpo d'occhio immediato sui dati.

### Tasks
- [x] Creare componente `StatsCards` con griglia di card Shadcn
- [x] Calcolare metriche lato frontend dai dati caricati:
  - **Totale asteroidi** nel range selezionato
  - **Distanza media** (km)
  - **Asteroide più vicino** (nome + distanza)
  - **Asteroide più grande** (nome + diametro max)
  - **Percentuale pericolosi** (X% su Y totale)
- [x] Mostrare le card in cima alla pagina, sopra la tabella
- [x] Icone per ogni card (es. ☄️, 📏, ⚠️)

### Criteri di Accettazione
- [x] Le card mostrano statistiche aggregate
- [x] I dati si aggiornano quando cambia il range di date
- [x] Layout responsive (2 colonne su desktop, 1 su mobile)

---

## US-28 (Bonus): Esportazione CSV

**Come** utente,
**Voglio** esportare i dati in CSV,
**Così da** poterli analizzare con Excel o altri strumenti.

### Tasks
- [x] Aggiungere bottone "📥 Export CSV" sopra la tabella
- [x] Generare CSV dai dati correnti (inclusi filtri attivi)
- [x] Colonne CSV: Name, ID, Date, Distance (km), Diameter Min (km), Diameter Max (km), Velocity (km/h), Hazardous
- [x] Scaricare il file con nome `nasa-neo-{start_date}-{end_date}.csv`
- [x] Usare `Blob` e `URL.createObjectURL` per il download

### Criteri di Accettazione
- [x] Il CSV si scarica con i dati corretti
- [x] Il nome del file include il range di date
- [x] Il CSV è aperto correttamente in Excel/Google Sheets

---

## US-29 (Bonus): Visualizzazione Orbitale 3D

**Come** utente,
**Voglio** una visualizzazione 3D delle orbite degli asteroidi (Three.js),
**Così da** esplorare visivamente le traiettorie degli oggetti vicini alla Terra.

### Tasks
- [x] Integrare `@react-three/fiber` e `@react-three/drei`
- [x] Creare scena 3D con:
  - **Sole** al centro (sfera luminosa)
  - **Terra** in orbita (sfera blu con texture)
  - **Asteroidi** come punti/piccole sfere con orbite ellittiche
- [x] OrbitControls per ruotare/zoomare la scena
- [x] Click su asteroide 3D → apre scheda dettaglio
- [x] Legenda colori: rosso = pericoloso, grigio = non pericoloso

### Criteri di Accettazione
- [x] Scena 3D renderizzata correttamente
- [x] Asteroidi posizionati in base ai dati orbitali reali
- [x] Interazione click funzionante
- [x] Performance accettabile (non laggare)

---

## US-30 (Bonus): Notifica Asteroidi Pericolosi

**Come** utente,
**Voglio** ricevere un avviso visivo se ci sono asteroidi pericolosi nel range selezionato,
**Così da** essere immediatamente informato di potenziali rischi.

### Tasks
- [x] Creare componente `HazardAlert` che appare quando:
  - Ci sono asteroidi pericolosi nel range selezionato
- [x] Mostrare:
  - Icona ⚠️
  - Messaggio: "Attenzione: X asteroidi potenzialmente pericolosi rilevati in questo periodo."
  - Bottone "Show Hazardous Only" che attiva il filtro
- [x] Animazione di entrata (fade-in)
- [x] Colore rosso/arancione per attirare l'attenzione

### Criteri di Accettazione
- [x] Alert visibile solo quando ci sono asteroidi pericolosi
- [x] Bottone "Show Hazardous Only" funziona
- [x] Alert non invasivo (si può chiudere)
