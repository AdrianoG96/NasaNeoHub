# 🛡️ Milestone 6: UX Robusta — Loading, Errori, Edge Case

> Raffinamento dell'esperienza utente per gestire ogni situazione.

---

## US-21: Messaggi di Errore Chiari

**Come** utente,
**Voglio** messaggi di errore chiari per: rate limit, range troppo lungo, date non valide,
**Così da** capire cosa è andato storto e come risolvere.

### Tasks
- [x] Creare componente `ErrorAlert` con Shadcn `<Alert variant="destructive">`
- [x] Mappare codici errore backend a messaggi user-friendly:
  - **429** → "Troppe richieste. Attendi qualche istante e riprova."
  - **422** → "Dati non validi. Controlla le date inserite."
  - **502/503** → "Il servizio NASA non è disponibile. Riprova più tardi."
  - **404** → "Nessun dato trovato per questa ricerca."
  - **Errore generico** → "Qualcosa è andato storto. Riprova."
- [x] Mostrare l'alert in cima alla pagina, sopra la tabella
- [x] Bottone "Dismiss" per chiudere l'alert

### Criteri di Accettazione
- [x] Ogni tipo di errore backend ha un messaggio user-friendly corrispondente
- [x] L'alert è visibile e non intrusivo

---

## US-22: Stato Vuoto — Nessun Asteroide Trovato

**Come** utente,
**Voglio** un messaggio "Nessun asteroide trovato" quando il range non contiene dati,
**Così da** sapere che la ricerca è stata completata ma non ha prodotto risultati.

### Tasks
- [x] Creare componente `EmptyState` con:
  - Icona (🔭 Telescope di lucide-react)
  - Titolo: "Nessun asteroide trovato"
  - Sottotitolo: "Prova con un range di date diverso."
- [x] Mostrare quando la risposta API contiene 0 asteroidi
- [x] Mostrare anche quando dopo il filtro "Hazardous" non rimangono risultati

### Criteri di Accettazione
- [x] Stato vuoto visibile quando non ci sono asteroidi
- [x] Messaggio chiaro e amichevole

---

## US-23: Responsive Design

**Come** utente,
**Voglio** che l'interfaccia sia responsive e funzioni su mobile,
**Così da** poter consultare la dashboard anche dal telefono.

### Tasks
- [x] Tabella scrollabile orizzontalmente su mobile (`overflow-x-auto`)
- [x] Grafici responsive con `ResponsiveContainer` di Recharts (già implementato)
- [x] Layout a colonna singola su schermi < 768px (padding, gap, font-size responsive)
- [x] Date picker full-width su mobile (`w-full` su mobile, `sm:w-44` su desktop)
- [x] Filtri e ordinamenti accessibili anche su touch (tabIndex, onKeyDown, aria-label)
- [ ] Testare su viewport 375px (iPhone SE) e 768px (iPad) — test manuale

### Criteri di Accettazione
- [x] La tabella è scrollabile orizzontalmente su mobile
- [x] I grafici si ridimensionano correttamente
- [x] Tutti i componenti sono utilizzabili su touch screen
