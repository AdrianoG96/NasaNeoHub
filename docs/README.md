# 📚 NasaNeoHub — Documentazione del Progetto

> Dashboard per esplorare gli asteroidi in avvicinamento alla Terra usando dati reali della NASA.

## 🗺️ Milestone

| # | Milestone | Descrizione | User Story |
|---|-----------|-------------|------------|
| 1 | [🏗️ Scaffolding e Setup](./milestones/01-scaffolding-e-setup.md) | Setup infrastruttura base backend + frontend | US-01 → US-03 |
| 2 | [🚀 Backend Core — Proxy con Caching](./milestones/02-backend-core-proxy-caching.md) | Proxy intelligente verso NASA API | US-04 → US-08 |
| 3 | [📋 Frontend — Lista Asteroidi con Filtri](./milestones/03-frontend-lista-filtri.md) | Tabella interattiva di asteroidi | US-09 → US-13 |
| 4 | [📊 Frontend — Grafici con Recharts](./milestones/04-frontend-grafici.md) | Visualizzazioni dati | US-14 → US-16 |
| 5 | [🔍 Frontend — Scheda Dettaglio Asteroide](./milestones/05-frontend-scheda-dettaglio.md) | Vista approfondita asteroide | US-17 → US-20 |
| 6 | [🛡️ UX Robusta](./milestones/06-ux-robusta.md) | Loading, errori, edge case | US-21 → US-23 |
| 7 | [🌐 Deploy e CI/CD](./milestones/07-deploy-cicd.md) | Progetto online | US-24 → US-26 |
| 8 | [🎯 Bonus: Miglioramenti](./milestones/08-bonus-miglioramenti.md) | Extra features creative | US-27 → US-30 |

## 📋 Riepilogo User Story

| US | Titolo | Milestone | Priorità |
|----|--------|-----------|----------|
| US-01 | Inizializzazione Backend FastAPI | 1 | 🔴 Alta |
| US-02 | Inizializzazione Frontend Next.js | 1 | 🔴 Alta |
| US-03 | Configurazione Variabili d'Ambiente | 1 | 🔴 Alta |
| US-04 | Endpoint Feed Asteroidi | 2 | 🔴 Alta |
| US-05 | Gestione Range di Date Arbitrari | 2 | 🔴 Alta |
| US-06 | Caching delle Risposte | 2 | 🔴 Alta |
| US-07 | Endpoint Dettaglio Asteroide | 2 | 🔴 Alta |
| US-08 | Gestione Errori NASA | 2 | 🔴 Alta |
| US-09 | Tabella Asteroidi | 3 | 🔴 Alta |
| US-10 | Date Range Picker | 3 | 🔴 Alta |
| US-11 | Filtro Asteroidi Pericolosi | 3 | 🟡 Media |
| US-12 | Ordinamento Colonne | 3 | 🟡 Media |
| US-13 | Skeleton Loader | 3 | 🟡 Media |
| US-14 | Grafico Distanza nel Tempo | 4 | 🔴 Alta |
| US-15 | Istogramma Dimensioni | 4 | 🔴 Alta |
| US-16 | Grafici Interattivi | 4 | 🟡 Media |
| US-17 | Apertura Scheda Dettaglio | 5 | 🔴 Alta |
| US-18 | Storico Close Approach | 5 | 🟡 Media |
| US-19 | Dati Orbitali e Link NASA JPL | 5 | 🟡 Media |
| US-20 | Loading e Errori Scheda Dettaglio | 5 | 🟡 Media |
| US-21 | Messaggi di Errore Chiari | 6 | 🟡 Media |
| US-22 | Stato Vuoto | 6 | 🟢 Bassa |
| US-23 | Responsive Design | 6 | 🟢 Bassa |
| US-24 | Deploy Backend | 7 | 🔴 Alta |
| US-25 | Deploy Frontend | 7 | 🔴 Alta |
| US-26 | README.md Completo | 7 | 🟡 Media |
| US-27 | Dashboard Riassuntiva | 8 (Bonus) | 🟢 Bassa |
| US-28 | Esportazione CSV | 8 (Bonus) | 🟢 Bassa |
| US-29 | Visualizzazione Orbitale 3D | 8 (Bonus) | 🟢 Bassa |
| US-30 | Notifica Asteroidi Pericolosi | 8 (Bonus) | 🟢 Bassa |

## 🎯 Ordine di Sviluppo Consigliato

```
Milestone 1 ──► Milestone 2 ──► Milestone 3 ──► Milestone 4 ──► Milestone 5 ──► Milestone 6 ──► Milestone 7
                                                                                                      │
                                                                                            Milestone 8 (Bonus)
```

Ogni milestone produce qualcosa di **funzionante e testabile** prima di passare alla successiva.
