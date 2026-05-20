# 🎯 Milestone 8 (Bonus): Miglioramenti e Creatività

> Oltre i requisiti base — idee per distinguersi.

---

## US-27 (Bonus): Dashboard Riassuntiva

**Come** utente,
**Voglio** vedere una dashboard riassuntiva con statistiche: totale asteroidi, media distanza, più pericoloso, più grande,
**Così da** avere un colpo d'occhio immediato sui dati.

### Tasks
- [ ] Creare componente `StatsCards` con griglia di card Shadcn
- [ ] Calcolare metriche lato frontend dai dati caricati:
  - **Totale asteroidi** nel range selezionato
  - **Distanza media** (km)
  - **Asteroide più vicino** (nome + distanza)
  - **Asteroide più grande** (nome + diametro max)
  - **Percentuale pericolosi** (X% su Y totale)
- [ ] Mostrare le card in cima alla pagina, sopra la tabella
- [ ] Icone per ogni card (es. ☄️, 📏, ⚠️)

### Criteri di Accettazione
- [ ] Le card mostrano statistiche aggregate
- [ ] I dati si aggiornano quando cambia il range di date
- [ ] Layout responsive (2 colonne su desktop, 1 su mobile)

---

## US-28 (Bonus): Esportazione CSV

**Come** utente,
**Voglio** esportare i dati in CSV,
**Così da** poterli analizzare con Excel o altri strumenti.

### Tasks
- [ ] Aggiungere bottone "📥 Export CSV" sopra la tabella
- [ ] Generare CSV dai dati correnti (inclusi filtri attivi)
- [ ] Colonne CSV: Name, ID, Date, Distance (km), Diameter Min (km), Diameter Max (km), Velocity (km/h), Hazardous
- [ ] Scaricare il file con nome `nasa-neo-{start_date}-{end_date}.csv`
- [ ] Usare `Blob` e `URL.createObjectURL` per il download

### Criteri di Accettazione
- [ ] Il CSV si scarica con i dati corretti
- [ ] Il nome del file include il range di date
- [ ] Il CSV è aperto correttamente in Excel/Google Sheets

---

## US-29 (Bonus): Visualizzazione Orbitale 3D

**Come** utente,
**Voglio** una visualizzazione 3D delle orbite degli asteroidi (Three.js),
**Così da** esplorare visivamente le traiettorie degli oggetti vicini alla Terra.

### Tasks
- [ ] Integrare `@react-three/fiber` e `@react-three/drei`
- [ ] Creare scena 3D con:
  - **Sole** al centro (sfera luminosa)
  - **Terra** in orbita (sfera blu con texture)
  - **Asteroidi** come punti/piccole sfere con orbite ellittiche
- [ ] OrbitControls per ruotare/zoomare la scena
- [ ] Click su asteroide 3D → apre scheda dettaglio
- [ ] Legenda colori: rosso = pericoloso, grigio = non pericoloso

### Criteri di Accettazione
- [ ] Scena 3D renderizzata correttamente
- [ ] Asteroidi posizionati in base ai dati orbitali reali
- [ ] Interazione click funzionante
- [ ] Performance accettabile (non laggare)

---

## US-30 (Bonus): Notifica Asteroidi Pericolosi

**Come** utente,
**Voglio** ricevere un avviso visivo se ci sono asteroidi pericolosi nel range selezionato,
**Così da** essere immediatamente informato di potenziali rischi.

### Tasks
- [ ] Creare componente `HazardAlert` che appare quando:
  - Ci sono asteroidi pericolosi nel range selezionato
- [ ] Mostrare:
  - Icona ⚠️
  - Messaggio: "Attenzione: X asteroidi potenzialmente pericolosi rilevati in questo periodo."
  - Bottone "Show Hazardous Only" che attiva il filtro
- [ ] Animazione di entrata (fade-in)
- [ ] Colore rosso/arancione per attirare l'attenzione

### Criteri di Accettazione
- [ ] Alert visibile solo quando ci sono asteroidi pericolosi
- [ ] Bottone "Show Hazardous Only" funziona
- [ ] Alert non invasivo (si può chiudere)
