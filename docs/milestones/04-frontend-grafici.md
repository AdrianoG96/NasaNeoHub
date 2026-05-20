# 📊 Milestone 4: Frontend — Grafici con Recharts

> Visualizzazioni dati per raccontare storie.

---

## US-14: Grafico a Dispersione — Distanza nel Tempo

**Come** utente,
**Voglio** un grafico a dispersione (scatter) che mostri la distanza di avvicinamento nel tempo,
**Così da** visualizzare la distribuzione temporale degli asteroidi e identificare periodi di maggiore attività.

### Tasks
- [x] Installare `recharts` nel progetto frontend
- [x] Creare il componente `DistanceScatterChart`
- [x] Asse X: `close_approach_date` (formato data)
- [x] Asse Y: `miss_distance_km` (scala logaritmica opzionale per gestire outlier)
- [x] Colore punti: rosso per asteroidi pericolosi, blu per non pericolosi
- [x] Tooltip al passaggio del mouse che mostra:
  - Nome asteroide
  - Data
  - Distanza (km)
  - Pericolosità
- [x] Responsive container (`ResponsiveContainer`)

### Criteri di Accettazione
- [x] Il grafico si popola con i dati correnti
- [x] I punti sono colorati in base alla pericolosità
- [x] Il tooltip mostra informazioni dettagliate
- [x] Il grafico è responsive

---

## US-15: Istogramma — Distribuzione Dimensioni

**Come** utente,
**Voglio** un istogramma della distribuzione dei diametri degli asteroidi,
**Così da** capire rapidamente la composizione dimensionale della popolazione di asteroidi.

### Tasks
- [x] Creare il componente `DiameterBarChart`
- [x] Asse X: bin di diametro (es. 0-0.1km, 0.1-0.5km, 0.5-1km, 1-5km, 5+ km)
- [x] Asse Y: conteggio asteroidi per bin
- [x] Colore delle barre: gradiente o colore fisso
- [x] Tooltip che mostra: range diametro, conteggio, percentuale sul totale
- [ ] Opzionale: overlay con linea di media/mediana

### Criteri di Accettazione
- [x] L'istogramma mostra la distribuzione dei diametri
- [x] I bin sono significativi e coprono tutto il range
- [x] Il tooltip mostra conteggio e percentuale

---

## US-16: Grafici Interattivi

**Come** utente,
**Voglio** che i grafici siano interattivi (tooltip, zoom, brush),
**Così da** esplorare i dati in dettaglio.

### Tasks
- [x] Aggiungere `Tooltip` personalizzato a entrambi i grafici
- [x] Aggiungere `Brush` di Recharts per selezionare intervalli temporali nello scatter
- [x] Aggiungere legenda interattiva (click per mostrare/nascondere serie)
- [x] Rendere i grafici responsive con `ResponsiveContainer`

### Criteri di Accettazione
- [x] Tooltip funzionante su entrambi i grafici
- [x] Brush permette di selezionare un intervallo nello scatter
- [x] Legenda cliccabile per filtrare serie
- [x] I grafici si ridimensionano con la finestra
