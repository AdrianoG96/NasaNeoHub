# 📊 Milestone 4: Frontend — Grafici con Recharts

> Visualizzazioni dati per raccontare storie.

---

## US-14: Grafico a Dispersione — Distanza nel Tempo

**Come** utente,
**Voglio** un grafico a dispersione (scatter) che mostri la distanza di avvicinamento nel tempo,
**Così da** visualizzare la distribuzione temporale degli asteroidi e identificare periodi di maggiore attività.

### Tasks
- [ ] Installare `recharts` nel progetto frontend
- [ ] Creare il componente `DistanceScatterChart`
- [ ] Asse X: `close_approach_date` (formato data)
- [ ] Asse Y: `miss_distance_km` (scala logaritmica opzionale per gestire outlier)
- [ ] Colore punti: rosso per asteroidi pericolosi, blu per non pericolosi
- [ ] Tooltip al passaggio del mouse che mostra:
  - Nome asteroide
  - Data
  - Distanza (km)
  - Pericolosità
- [ ] Responsive container (`ResponsiveContainer`)

### Criteri di Accettazione
- [ ] Il grafico si popola con i dati correnti
- [ ] I punti sono colorati in base alla pericolosità
- [ ] Il tooltip mostra informazioni dettagliate
- [ ] Il grafico è responsive

---

## US-15: Istogramma — Distribuzione Dimensioni

**Come** utente,
**Voglio** un istogramma della distribuzione dei diametri degli asteroidi,
**Così da** capire rapidamente la composizione dimensionale della popolazione di asteroidi.

### Tasks
- [ ] Creare il componente `DiameterBarChart`
- [ ] Asse X: bin di diametro (es. 0-0.1km, 0.1-0.5km, 0.5-1km, 1-5km, 5+ km)
- [ ] Asse Y: conteggio asteroidi per bin
- [ ] Colore delle barre: gradiente o colore fisso
- [ ] Tooltip che mostra: range diametro, conteggio, percentuale sul totale
- [ ] Opzionale: overlay con linea di media/mediana

### Criteri di Accettazione
- [ ] L'istogramma mostra la distribuzione dei diametri
- [ ] I bin sono significativi e coprono tutto il range
- [ ] Il tooltip mostra conteggio e percentuale

---

## US-16: Grafici Interattivi

**Come** utente,
**Voglio** che i grafici siano interattivi (tooltip, zoom, brush),
**Così da** esplorare i dati in dettaglio.

### Tasks
- [ ] Aggiungere `Tooltip` personalizzato a entrambi i grafici
- [ ] Aggiungere `Brush` di Recharts per selezionare intervalli temporali nello scatter
- [ ] Aggiungere legenda interattiva (click per mostrare/nascondere serie)
- [ ] Rendere i grafici responsive con `ResponsiveContainer`

### Criteri di Accettazione
- [ ] Tooltip funzionante su entrambi i grafici
- [ ] Brush permette di selezionare un intervallo nello scatter
- [ ] Legenda cliccabile per filtrare serie
- [ ] I grafici si ridimensionano con la finestra
