# 📊 Milestone 12: Miglioramento Grafici e Chart

> Potenziamento della sezione di visualizzazione dati con nuovi grafici interattivi, analisi comparative e insight visuali avanzati.

---

## US-40: Grafico a Linee — Velocità Relativa nel Tempo

**Come** utente,
**Voglio** un grafico a linee che mostri l'andamento della velocità relativa degli asteroidi nel periodo selezionato,
**Così da** identificare trend di velocità e correlazioni temporali.

### Tasks
- [x] Creare il componente `VelocityLineChart`
- [x] Asse X: `close_approach_date` (cronologico)
- [x] Asse Y: `relative_velocity_kph`
- [x] Linea principale con area gradient fill sotto la curva
- [x] Punti dati interattivi con tooltip (nome, velocità, data)
- [x] Overlay opzionale: linea di media mobile (rolling average a 3 punti)
- [x] Colore linea: gradiente blu-ciano con glow effect
- [x] Responsive container

### Criteri di Accettazione
- [x] Il grafico mostra la velocità di tutti gli asteroidi nel tempo
- [x] La linea di media mobile è attivabile/disattivabile
- [x] Tooltip mostra nome, velocità e data
- [x] Area gradient sotto la curva per impatto visivo

---

## US-41: Grafico Combinato — Diametro vs Distanza (Bubble Chart)

**Come** utente,
**Voglio** un bubble chart che incroci diametro, distanza e pericolosità,
**Così da** avere una visione multidimensionale della popolazione di asteroidi in un unico grafico.

### Tasks
- [x] Creare il componente `BubbleComparisonChart`
- [x] Asse X: `miss_distance_km`
- [x] Asse Y: `estimated_diameter_max_km`
- [x] Raggio bolla: scala basata sul diametro (o velocità)
- [x] Colore bolla: rosso per pericolosi, blu per non pericolosi
- [x] Tooltip avanzato: nome, distanza, diametro, velocità, pericolosità
- [x] Legenda interattiva
- [x] Opzionale: scala logaritmica per l'asse X (toggle)

### Criteri di Accettazione
- [x] Bubble chart mostra correlazione diametro-distanza
- [x] Le bolle sono dimensionate proporzionalmente
- [x] Colori distinguono pericolosità
- [x] Tooltip completo su hover

---

## US-42: Grafico a Torta — Distribuzione Fasce di Rischio

**Come** utente,
**Voglio** un grafico a torta (o donut) che mostri la proporzione tra asteroidi pericolosi e non pericolosi,
**Così da** capire immediatamente il rapporto di rischio.

### Tasks
- [x] Creare il componente `HazardDonutChart`
- [x] Due sezioni: "Potentially Hazardous" (rossa) e "Non-Hazardous" (verde/blu)
- [x] Etichette con percentuale e conteggio assoluto
- [x] Tooltip: categoria, conteggio, percentuale
- [x] Animazione di entrata (reveal progressivo)
- [x] Al centro del donut: numero totale asteroidi
- [x] Opzionale: terza sezione "Unknown" se dati mancanti

### Criteri di Accettazione
- [x] Donut chart mostra rapporto pericolosi/non pericolosi
- [x] Percentuali e conteggi visibili
- [x] Animazione fluida all'ingresso
- [x] Centro del donut mostra il totale

---

## US-43: Grafico a Barre Impilate — Distribuzione Dimensioni per Fascia di Rischio

**Come** utente,
**Voglio** un grafico a barre impilate che mostri la distribuzione dei diametri suddivisa per pericolosità,
**Così da** capire se gli asteroidi più grandi tendono a essere più pericolosi.

### Tasks
- [x] Creare il componente `StackedDiameterChart`
- [x] Asse X: bin di diametro (stessi bin di `DiameterBarChart`)
- [x] Asse Y: conteggio asteroidi
- [x] Barre impilate: segmento rosso (pericolosi) + segmento blu (non pericolosi)
- [x] Tooltip: range diametro, conteggio pericolosi, conteggio non pericolosi, totale
- [x] Legenda interattiva
- [x] Opzionale: toggle per switchare tra conteggio assoluto e percentuale

### Criteri di Accettazione
- [x] Barre impilate mostrano la composizione per fascia di rischio
- [x] Tooltip mostra dettaglio per segmento
- [x] Legenda funzionante
- [x] Toggle conteggio/percentuale opzionale

---

## US-44: Pannello di Controllo Grafici — Filtri e Personalizzazione

**Come** utente,
**Voglio** un pannello di controllo unificato per personalizzare la visualizzazione dei grafici,
**Così da** adattare le chart alle mie esigenze di analisi.

### Tasks
- [x] Creare il componente `ChartControls`
- [x] Selettore per tipo di grafico da visualizzare (dropdown o tab row)
- [x] Toggle per scala logaritmica/lineare sugli assi (dove applicabile)
- [x] Toggle per mostrare/nascondere media mobile
- [x] Selettore per metrica principale (distanza, velocità, diametro)
- [x] Pulsante "Reset to defaults"
- [x] Stato persistente via URL params (opzionale)

### Criteri di Accettazione
- [x] I controlli modificano la visualizzazione in tempo reale
- [x] Reset ripristina le impostazioni predefinite
- [x] UI compatta e non invasiva
- [x] I controlli sono disabilitati durante il caricamento

---

## US-45: Tabella Riepilogativa dei Grafici — Mini Stats per Chart

**Come** utente,
**Voglio** vedere delle statistiche riassuntive accanto a ogni grafico (min, max, media, mediana),
**Così da** avere dati numerici immediati senza dover interpretare il grafico.

### Tasks
- [x] Creare il componente `ChartSummaryStats`
- [x] Per ogni grafico, calcolare e mostrare:
  - Valore minimo
  - Valore massimo
  - Media
  - Mediana
- [x] Layout: barra orizzontale compatta sotto il titolo del grafico
- [x] Icone per ogni statistica
- [x] Animazione conteggio progressivo all'ingresso

### Criteri di Accettazione
- [x] Le statistiche sono calcolate correttamente sui dati filtrati
- [x] Layout compatto e non invasivo
- [x] I valori si aggiornano al cambio dei filtri
- [x] Animazione fluida

---

## US-46: Modalità Confronto Grafici — Side-by-Side View

**Come** utente,
**Voglio** poter confrontare due grafici affiancati in modalità split-view,
**Così da** analizzare correlazioni tra metriche diverse (es. distanza vs velocità).

### Tasks
- [x] Aggiungere toggle "Split View" nella tab Charts
- [x] In modalità split: due pannelli affiancati (50/50 o 60/40)
- [x] Selettori indipendenti per il tipo di grafico in ogni pannello
- [x] Sincronizzazione dei dati (stessi filtri attivi)
- [x] Transizione fluida tra single view e split view
- [x] Opzionale: sincronizzazione hover tra i due grafici (crosshair)

### Criteri di Accettazione
- [x] Split view mostra due grafici affiancati
- [x] Ogni pannello ha il suo selettore di tipo grafico
- [x] Transizione fluida all'attivazione/disattivazione
- [x] Layout responsive (stack su mobile)

---

## US-47: Heatmap — Attività Asteroidi per Giorno della Settimana

**Come** utente,
**Voglio** una heatmap che mostri l'attività degli asteroidi per giorno della settimana e fascia oraria (approssimata per data),
**Così da** identificare pattern temporali negli avvicinamenti.

### Tasks
- [x] Creare il componente `ActivityHeatmapChart`
- [x] Asse X: giorni della settimana (Lun-Dom)
- [x] Asse Y: fasce del mese (settimana 1-4)
- [x] Colore cella: intensità basata sul conteggio asteroidi
- [x] Tooltip: giorno, conteggio asteroidi, dettaglio pericolosi
- [x] Legenda colori (gradiente dal chiaro allo scuro)
- [x] Opzionale: filtro per mostrare solo pericolosi

### Criteri di Accettazione
- [x] Heatmap mostra distribuzione temporale degli asteroidi
- [x] Colori rappresentano l'intensità
- [x] Tooltip funzionante su ogni cella
- [x] Dati sufficienti per pattern significativi

---

## US-48: Grafico Radar — Confronto Multi-Metrica per Asteroide

**Come** utente,
**Voglio** un grafico radar che confronti più metriche per un asteroide selezionato rispetto alla media del dataset,
**Così da** valutare rapidamente quanto un asteroide si discosta dalla norma.

### Tasks
- [x] Creare il componente `AsteroidRadarChart`
- [x] Metriche sul radar (normalizzate 0-100%):
  - Distanza (inversa: più vicino = più alto)
  - Diametro
  - Velocità
  - Pericolosità (binario: 0 o 100)
  - Eccentricità orbitale (se disponibile)
- [x] Due poligoni sovrapposti: asteroide selezionato vs media dataset
- [x] Tooltip: metrica, valore asteroide, valore medio
- [x] Legenda: "Selected Asteroid" / "Dataset Average"
- [x] Accessibile dalla scheda dettaglio asteroide

### Criteri di Accettazione
- [x] Radar chart mostra il profilo dell'asteroide vs media
- [x] Metriche normalizzate correttamente
- [x] Tooltip informativo
- [x] Integrato nella scheda dettaglio

---

## US-49: Istogramma Animato — Evoluzione Temporale delle Scoperte

**Come** utente,
**Voglio** un istogramma animato che mostri l'evoluzione del numero di asteroidi giorno per giorno nel range selezionato,
**Così da** visualizzare i picchi di attività e i trend temporali.

### Tasks
- [x] Creare il componente `DailyDiscoveryChart`
- [x] Asse X: date (giorno per giorno)
- [x] Asse Y: conteggio asteroidi
- [x] Barre animate con effetto "race" (crescita progressiva)
- [x] Colore barre: gradiente basato sul numero di pericolosi quel giorno
- [x] Tooltip: data, totale asteroidi, pericolosi, non pericolosi
- [x] Opzionale: linea di trend (media mobile 3 giorni)

### Criteri di Accettazione
- [x] Istogramma mostra il conteggio giornaliero
- [x] Animazione fluida delle barre
- [x] Colore delle barre riflette la pericolosità
- [x] Tooltip con dettaglio giornaliero

---

## US-50: Pulsante Screenshot — Esporta Grafico come PNG

**Come** utente,
**Voglio** poter esportare un singolo grafico come immagine PNG,
**Così da** salvarlo o condividerlo facilmente.

### Tasks
- [x] Aggiungere pulsante "📷 Export PNG" a ogni grafico
- [x] Usare `html-to-image` o canvas API per catturare il grafico
- [x] Nome file: `nasa-neo-{chart-type}-{date-range}.png`
- [x] Toast di conferma dopo l'esportazione
- [x] Opzionale: includere titolo e legenda nell'immagine

### Criteri di Accettazione
- [x] Il PNG viene scaricato correttamente
- [x] Il nome del file è descrittivo
- [x] La qualità dell'immagine è buona
- [x] Funziona per tutti i tipi di grafico

---

## US-51: Dark Mode Ottimizzata per Grafici

**Come** utente,
**Voglio** che i grafici si adattino perfettamente al tema scuro dell'applicazione,
**Così da** avere un'esperienza visiva coerente e piacevole.

### Tasks
- [x] Verificare che tutti i grafici usino variabili CSS per i colori (hsl(var(--...)))
- [x] Assicurarsi che grid, axis, label, tooltip, legend siano coerenti con il tema scuro
- [x] Aggiungere glow effect sottile per elementi interattivi (hover)
- [x] Testare contrasto e leggibilità in dark mode
- [x] Opzionale: tema chiaro alternativo (toggle)

### Criteri di Accettazione
- [x] Tutti i grafici sono leggibili in dark mode
- [x] Colori coerenti con il resto dell'app
- [x] Glow/hover effect funzionanti
- [x] Nessun problema di contrasto

---

## Riepilogo Modifiche ai File

| File | Azione |
|------|--------|
| `frontend/src/components/VelocityLineChart.tsx` | **Nuovo** — Grafico velocità nel tempo |
| `frontend/src/components/BubbleComparisonChart.tsx` | **Nuovo** — Bubble chart diametro vs distanza |
| `frontend/src/components/HazardDonutChart.tsx` | **Nuovo** — Donut chart pericolosità |
| `frontend/src/components/StackedDiameterChart.tsx` | **Nuovo** — Barre impilate dimensione/rischio |
| `frontend/src/components/ChartControls.tsx` | **Nuovo** — Pannello controllo grafici |
| `frontend/src/components/ChartSummaryStats.tsx` | **Nuovo** — Statistiche riassuntive per chart |
| `frontend/src/components/ActivityHeatmapChart.tsx` | **Nuovo** — Heatmap attività temporale |
| `frontend/src/components/AsteroidRadarChart.tsx` | **Nuovo** — Radar chart confronto multi-metrica |
| `frontend/src/components/DailyDiscoveryChart.tsx` | **Nuovo** — Istogramma animato scoperte giornaliere |
| `frontend/src/components/ExportChartButton.tsx` | **Nuovo** — Pulsante esportazione PNG |
| `frontend/src/components/DashboardTabs.tsx` | **Modifica** — Aggiungere split view, nuovi grafici, chart controls |
| `frontend/src/lib/types.ts` | **Nessuna modifica** — Tipi esistenti sufficienti |
| `frontend/package.json` | **Modifica** — Aggiungere `html-to-image` per export PNG |
