# Milestone 11 — Miglioramento Visualizzazione 3D Asteroidi

## Obiettivo
Migliorare significativamente la visualizzazione 3D delle orbite degli asteroidi, rendendola più realistica, interattiva e informativa. L'attuale implementazione usa posizioni casuali derivate dall'ID dell'asteroide; l'obiettivo è sfruttare i dati orbitali reali (eccentricità, semiasse maggiore, inclinazione, etc.) per posizionare correttamente gli asteroidi nelle loro orbite reali, aggiungere effetti visivi immersivi e migliorare l'interazione utente.

## Modifiche Implementate

### 1. Orbite Reali Basate su Dati Orbitali
- **Orbite ellittiche reali**: Calcolo della posizione 3D degli asteroidi usando eccentricità, semiasse maggiore, inclinazione, longitudine del nodo ascendente e argomento del perielio
- **Linee d'orbita**: Visualizzazione delle orbite ellittiche complete per ogni asteroide (o per un sottoinsieme selezionato)
- **Scala dinamica**: Adattamento automatico della scala di visualizzazione in base alla distanza degli asteroidi
- **Fallback**: Se i dati orbitali non sono disponibili, uso della posizione basata su `miss_distance_km` con distribuzione sferica migliorata

### 2. Effetti Visivi Immersivi
- **Particelle stellari**: Sfondo con campo stellare 3D per profondità
- **Glow del Sole**: Effetto bagliore volumetrico attorno al Sole con lente
- **Anello di orbita terrestre**: Orbita terrestre evidenziata con linea tratteggiata animata
- **Trail degli asteroidi**: Scia luminosa per asteroidi in movimento (opzionale, toggleabile)
- **Nebulosa di sfondo**: Sottile effetto nebulosa con gradienti di colore cosmici

### 3. Interattività Avanzata
- **Click su asteroide**: Apertura scheda dettaglio con informazioni complete
- **Hover tooltip**: Tooltip migliorato con nome, diametro, distanza, velocità e indicatore pericolosità
- **Selezione multipla**: Possibilità di selezionare/deselezionare asteroidi per confronto
- **Filtri in-scena**: Pulsanti per filtrare la visuale (solo pericolosi, solo vicini, etc.)
- **Reset camera**: Bottone per resettare la posizione della camera alla vista iniziale
- **Auto-rotate**: Toggle per rotazione automatica della scena

### 4. Legenda e Didascalie Migliorate
- **Legenda interattiva**: Legenda cliccabile che mostra/nasconde categorie di asteroidi
- **Scala di distanza**: Indicatore visivo della scala corrente (es. "1 unità = 100.000 km")
- **Badge informativi**: Numero di asteroidi visibili, range di distanza, count pericolosi/non pericolosi
- **Etichette orbite**: Nomi degli asteroidi più grandi/vicini visualizzati direttamente accanto alle orbite

### 5. Performance Optimization
- **Instancing**: Uso di `instancedMesh` per asteroidi numerosi (>50) per ridurre draw calls
- **LOD (Level of Detail)**: Riduzione della qualità geometrica per asteroidi lontani
- **Limite configurabile**: Numero massimo di asteroidi renderizzati (es. 200) con avviso se superato
- **Memoization**: Ottimizzazione dei calcoli di posizione con `useMemo`
- **Lazy loading**: Caricamento ritardato della scena 3D (già implementato con pulsante "Load 3D Visualization")

### 6. UI/UX della Scena 3D
- **Pannello di controllo**: Overlay con controlli per:
  - Mostra/nascondi orbite
  - Mostra/nascondi etichette
  - Velocità animazione
  - Toggle auto-rotate
  - Filtro pericolosità
- **Mini-mappa**: Piccola mappa in angolo con vista dall'alto per orientamento
- **Tooltip informativo**: Suggerimenti su come interagire (click, drag, zoom)
- **Stato vuoto**: Messaggio migliorato quando non ci sono dati 3D disponibili

### 7. Dettaglio Asteroide 3D
- **AsteroidDetail3D**: Nuovo componente per visualizzare un singolo asteroide in 3D
- Modello 3D semplificato dell'asteroide con forma irregolare (icosaedro con vertex displacement)
- Rotazione su più assi per effetto realistico
- Ombre proprie e superficie texturizzata proceduralmente
- Confronto visivo con oggetti familiari (es. "grande come un campo da calcio")

## File Creati
- `frontend/src/components/OrbitLine3D.tsx` — Componente per orbite ellittiche 3D
- `frontend/src/components/StarField.tsx` — Sfondo con campo stellare 3D
- `frontend/src/components/SceneControls.tsx` — Pannello di controllo interattivo
- `frontend/src/components/AsteroidDetail3D.tsx` — Visualizzazione 3D dettaglio singolo asteroide
- `frontend/src/components/AsteroidLabel.tsx` — Etichette testo per asteroidi
- `frontend/src/lib/orbitalMath.ts` — Funzioni matematiche per calcoli orbitali

## File Modificati
- `frontend/src/components/OrbitVisualization.tsx` — Refactoring completo con orbite reali, effetti visivi, interattività
- `frontend/src/components/DashboardTabs.tsx` — Integrazione nuovi controlli e filtri 3D
- `frontend/src/lib/types.ts` — Eventuali nuovi tipi per configurazione 3D

## Dettaglio Implementazione

### Calcolo Posizione Orbitale (`orbitalMath.ts`)
```typescript
// Funzione per calcolare posizione 3D di un asteroide dai dati orbitali
function calculateOrbitalPosition(
  eccentricity: number,
  semiMajorAxis: number,  // in AU
  inclination: number,    // in gradi
  ascendingNode: number,  // longitudine nodo ascendente in gradi
  perihelionArg: number,  // argomento del perielio in gradi
  meanAnomaly: number     // anomalia media in gradi
): { x: number; y: number; z: number }
```

### Architettura OrbitLine3D
- Accetta parametri orbitali e genera i punti dell'ellisse
- Usa `Line` di drei con materiale personalizzato
- Colore basato sulla pericolosità dell'asteroide
- Opacità regolabile dal pannello di controllo

### Sistema di Instancing
- Per >50 asteroidi: `instancedMesh` con matrice di trasformazione
- Colori per-instance per distinguere pericolosi/non pericolosi
- Click detection via raycasting con instanced mesh

## Criteri di Accettazione
- [x] Le orbite degli asteroidi sono calcolate dai dati orbitali reali (quando disponibili)
- [x] La scena 3D è visivamente immersiva con stelle, glow, nebulosa e effetti cosmici
- [x] Click su asteroide apre il dettaglio con informazioni complete
- [x] Tooltip hover mostra nome, diametro, distanza e pericolosità
- [x] Filtri in-scena funzionano (solo pericolosi, solo vicini, reset camera, auto-rotate)
- [x] Performance accettabile con >100 asteroidi (instancedMesh per >50, limite 200)
- [x] Legenda interattiva mostra/nasconde categorie
- [x] Pannello di controllo permette di regolare visualizzazione (orbite, etichette, velocità, filtri)
- [x] Fallback funziona quando dati orbitali non disponibili
- [x] Mini-mappa fornisce orientamento spaziale
