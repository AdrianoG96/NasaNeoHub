# 🛡️ Milestone 6: UX Robusta — Loading, Errori, Edge Case

> Raffinamento dell'esperienza utente per gestire ogni situazione.

---

## US-21: Messaggi di Errore Chiari

**Come** utente,
**Voglio** messaggi di errore chiari per: rate limit, range troppo lungo, date non valide,
**Così da** capire cosa è andato storto e come risolvere.

### Tasks
- [ ] Creare componente `ErrorAlert` con Shadcn `<Alert variant="destructive">`
- [ ] Mappare codici errore backend a messaggi user-friendly:
  - **429** → "Troppe richieste. Attendi qualche istante e riprova."
  - **422** → "Dati non validi. Controlla le date inserite."
  - **502/503** → "Il servizio NASA non è disponibile. Riprova più tardi."
  - **404** → "Nessun dato trovato per questa ricerca."
  - **Errore generico** → "Qualcosa è andato storto. Riprova."
- [ ] Mostrare l'alert in cima alla pagina, sopra la tabella
- [ ] Bottone "Dismiss" per chiudere l'alert

### Criteri di Accettazione
- [ ] Ogni tipo di errore backend ha un messaggio user-friendly corrispondente
- [ ] L'alert è visibile e non intrusivo
- [ ] L'alert si può chiudere

---

## US-22: Stato Vuoto — Nessun Asteroide Trovato

**Come** utente,
**Voglio** un messaggio "Nessun asteroide trovato" quando il range non contiene dati,
**Così da** sapere che la ricerca è stata completata ma non ha prodotto risultati.

### Tasks
- [ ] Creare componente `EmptyState` con:
  - Icona (es. 🔭 o 🌌)
  - Titolo: "Nessun asteroide trovato"
  - Sottotitolo: "Prova con un range di date diverso."
- [ ] Mostrare quando la risposta API contiene 0 asteroidi
- [ ] Mostrare anche quando dopo il filtro "Hazardous" non rimangono risultati

### Criteri di Accettazione
- [ ] Stato vuoto visibile quando non ci sono asteroidi
- [ ] Messaggio chiaro e amichevole
- [ ] Invito all'azione (cambiare date)

---

## US-23: Responsive Design

**Come** utente,
**Voglio** che l'interfaccia sia responsive e funzioni su mobile,
**Così da** poter consultare la dashboard anche dal telefono.

### Tasks
- [ ] Tabella scrollabile orizzontalmente su mobile (`overflow-x-auto`)
- [ ] Grafici responsive con `ResponsiveContainer` di Recharts
- [ ] Layout a colonna singola su schermi < 768px
- [ ] Date picker full-width su mobile
- [ ] Filtri e ordinamenti accessibili anche su touch
- [ ] Testare su viewport 375px (iPhone SE) e 768px (iPad)

### Criteri di Accettazione
- [ ] La tabella è scrollabile orizzontalmente su mobile
- [ ] I grafici si ridimensionano correttamente
- [ ] Tutti i componenti sono utilizzabili su touch screen
- [ ] Nessun overflow orizzontale rotto
