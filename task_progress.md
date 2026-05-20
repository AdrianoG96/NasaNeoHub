# Task Progress - Milestone 8: Bonus Miglioramenti

## US-27: Dashboard Riassuntiva (StatsCards)
- [x] Create StatsCards component with Shadcn card grid
- [x] Calculate metrics: total asteroids, avg distance, closest, largest, hazardous %
- [x] Show cards at top of page above the table
- [x] Icons for each card
- [x] Responsive layout (2 cols desktop, 1 mobile)

## US-28: Esportazione CSV
- [x] Add "Export CSV" button above the table
- [x] Generate CSV from current data (including active filters)
- [x] CSV columns: Name, ID, Date, Distance, Diameter Min/Max, Velocity, Hazardous
- [x] Download file with name `nasa-neo-{start_date}-{end_date}.csv`
- [x] Use Blob and URL.createObjectURL for download

## US-29: Visualizzazione Orbitale 3D (Three.js)
- [x] Integrate @react-three/fiber and @react-three/drei
- [x] Create 3D scene with Sun, Earth, Asteroids
- [x] OrbitControls for rotation/zoom
- [x] Click on asteroid opens detail card
- [x] Color legend: red = hazardous, gray = non-hazardous

## US-30: Notifica Asteroidi Pericolosi (HazardAlert)
- [x] Create HazardAlert component
- [x] Show warning when hazardous asteroids in range
- [x] "Show Hazardous Only" button that activates filter
- [x] Fade-in animation
- [x] Red/orange color scheme
- [x] Dismissible alert
