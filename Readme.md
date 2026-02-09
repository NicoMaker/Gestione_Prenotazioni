# 📖 Guida Utente Completa - Gestione Preventivi

--- 

## 🎯 Introduzione

**Gestione Preventivi** è un sistema completo per la gestione di clienti, marche, modelli di veicoli e preventivi. L'applicazione ti permette di:

- ✅ Gestire l'anagrafica completa dei clienti
- ✅ Organizzare marche e modelli di veicoli
- ✅ Creare e monitorare preventivi
- ✅ Stampare report raggruppati per cliente
- ✅ Gestire utenti del sistema

---

## 🔐 Accesso al Sistema

### 1. Apertura dell'Applicazione
1. Apri il browser web (Chrome, Firefox, Safari, Edge)
2. Inserisci l'indirizzo fornito dall'amministratore nella barra degli indirizzi
3. Attendi il caricamento della pagina di login

### 2. Login
1. **Nome Utente**: Inserisci il tuo nome utente (fornito dall'amministratore)
2. **Password**: Inserisci la tua password
   - 💡 **Suggerimento**: Clicca sull'icona dell'occhio per mostrare/nascondere la password mentre la digiti
3. Clicca sul pulsante **"ACCEDI"**

### 3. Gestione Errori di Login
- ⚠️ Se le credenziali sono errate, apparirà un messaggio di errore in rosso
- ⚠️ Se non riesci a connetterti al server, verifica la tua connessione internet
- 📞 In caso di problemi persistenti, contatta l'amministratore di sistema

### 4. Primo Accesso
Dopo il login corretto:
- Vedrai il messaggio "✓ Accesso effettuato!" in verde
- Verrai automaticamente reindirizzato alla dashboard principale
- La sezione "Clienti" sarà visualizzata per prima

---

## 🧭 Navigazione nell'Applicazione

### Dashboard Principale
La dashboard è composta da:

#### **Barra Laterale Sinistra (Sidebar)**
Qui trovi:
- **Logo e Titolo** dell'applicazione
- **Menu di Navigazione** con 5 sezioni:
  - 👥 **Clienti**
  - 🏷️ **Marche**
  - 📦 **Modelli**
  - 📋 **Preventivi**
  - 👤 **Utenti**
- **Informazioni Aziendali**:
  - Indirizzo sede
  - Partita IVA
- **Informazioni Utente**:
  - Il tuo nome utente
  - Ruolo (Amministratore)
- **Pulsante "Esci"** per il logout

#### **Area Principale (Centro)**
- Visualizza i contenuti della sezione attiva
- Include tabelle, filtri e pulsanti di azione

### Navigazione Mobile
Su smartphone e tablet:
1. Clicca sull'icona del **menu hamburger** (☰) in alto a sinistra
2. Si aprirà la barra laterale
3. Seleziona la sezione desiderata
4. Il menu si chiuderà automaticamente dopo la selezione

### Come Spostarsi tra le Sezioni
1. Clicca su una voce del menu nella barra laterale
2. La sezione selezionata si evidenzierà in blu
3. Il contenuto dell'area principale cambierà automaticamente
4. La tua ultima sezione visitata verrà ricordata al prossimo accesso

---

## 👥 Gestione Clienti

### Visualizzazione Lista Clienti
Nella sezione "Clienti" trovi:
- **Intestazione** con titolo e descrizione
- **Barra di ricerca** per filtrare i clienti
- **Filtro per data passaggio**
- **Pulsante "Nuovo Cliente"**
- **Tabella clienti** con le seguenti colonne:
  - Nome
  - Telefono
  - Email
  - Data Passaggio
  - Ricontatto (🔔 se attivo)
  - Azioni (✏️ Modifica, 🗑️ Elimina)

### Creare un Nuovo Cliente
1. Clicca sul pulsante **"Nuovo Cliente"** in alto a destra
2. Si aprirà una finestra modale
3. Compila i campi obbligatori:
   - **Nome**: Inserisci nome e cognome del cliente (es. "Mario Rossi")
   - **Telefono**: Inserisci il numero di telefono (es. "+39 333 1234567")
   - **Email**: Inserisci l'indirizzo email (es. "mario.rossi@email.com")
4. **Campi opzionali**:
   - **Data Passaggio**: Seleziona una data dal calendario
   - **Ricontatto Cliente**: Spunta la casella se il cliente va ricontattato
5. Clicca su **"Salva"** per confermare

💡 **Suggerimenti**:
- I campi con asterisco (*) sono obbligatori
- L'email deve essere valida (formato: nome@dominio.it)
- La data passaggio può essere lasciata vuota

### Cercare un Cliente
Hai due modi per cercare:

#### **Ricerca per Nome**
1. Clicca sulla barra di ricerca in alto
2. Inizia a digitare il nome del cliente
3. La tabella si aggiorna in tempo reale mostrando solo i risultati corrispondenti
4. La ricerca non distingue maiuscole/minuscole

#### **Filtro per Data Passaggio**
1. Clicca sul campo "Filtra per data passaggio"
2. Seleziona una data dal calendario
3. Verranno mostrati solo i clienti con quella data di passaggio
4. Per rimuovere il filtro, cancella la data selezionata

### Modificare un Cliente
1. Individua il cliente nella tabella
2. Clicca sull'icona della **matita** (✏️) nella colonna "Azioni"
3. Si aprirà la finestra modale con i dati precompilati
4. Modifica i campi desiderati
5. Clicca su **"Salva"** per confermare le modifiche
6. Clicca su **"Annulla"** per chiudere senza salvare

### Eliminare un Cliente
1. Individua il cliente nella tabella
2. Clicca sull'icona del **cestino** (🗑️) nella colonna "Azioni"
3. Apparirà una finestra di conferma
4. Clicca su **"Conferma"** per eliminare definitivamente
5. Clicca su **"Annulla"** per annullare l'operazione

⚠️ **IMPORTANTE**: Un cliente può essere eliminato **solo se non ha preventivi associati**. In caso contrario, apparirà un messaggio di errore.

### Significato dell'Icona Ricontatto
- 🔔 **Campanella visibile**: Il cliente deve essere ricontattato
- Questo campo aiuta a identificare rapidamente i clienti da richiamare

---

## 🏷️ Gestione Marche

Le marche rappresentano i produttori di veicoli (es. Yamaha, Honda, Ducati).

### Visualizzazione Lista Marche
Nella sezione "Marche" trovi:
- **Intestazione** con titolo e descrizione
- **Barra di ricerca** per filtrare le marche
- **Pulsante "Nuova Marca"**
- **Tabella marche** con le colonne:
  - Nome
  - Azioni (✏️ Modifica, 🗑️ Elimina)

### Creare una Nuova Marca
1. Clicca sul pulsante **"Nuova Marca"**
2. Si aprirà una finestra modale
3. Inserisci il **Nome** della marca (es. "Yamaha")
4. Clicca su **"Salva"**

💡 **Suggerimenti**:
- Il nome deve essere univoco (non puoi creare due marche con lo stesso nome)
- Usa nomi chiari e riconoscibili
- Controlla l'ortografia prima di salvare

### Cercare una Marca
1. Clicca sulla barra di ricerca
2. Inizia a digitare il nome della marca
3. La tabella si filtra automaticamente

### Modificare una Marca
1. Clicca sull'icona della **matita** (✏️) accanto alla marca
2. Modifica il nome nella finestra modale
3. Clicca su **"Salva"**

### Eliminare una Marca
1. Clicca sull'icona del **cestino** (🗑️)
2. Conferma l'eliminazione nella finestra che appare

⚠️ **IMPORTANTE**: Una marca può essere eliminata **solo se non ha modelli collegati**. Se la marca ha modelli associati, elimina prima tutti i modelli o cambiali di marca.

---

## 📦 Gestione Modelli

I modelli rappresentano i veicoli specifici di ogni marca (es. "MT-07" per Yamaha).

### Visualizzazione Lista Modelli
Nella sezione "Modelli" trovi:
- **Intestazione** con titolo e descrizione
- **Barra di ricerca**
- **Pulsante "Nuovo Modello"**
- **Tabella modelli** con le colonne:
  - Nome
  - Marca
  - Descrizione
  - Azioni (✏️ Modifica, 🗑️ Elimina)

### Creare un Nuovo Modello
1. Clicca sul pulsante **"Nuovo Modello"**
2. Compila i campi:
   - **Nome**: Nome del modello (es. "MT-07")
   - **Marca**: Inizia a digitare il nome della marca e selezionala dalla lista a tendina
3. **Campo opzionale**:
   - **Descrizione**: Aggiungi note o specifiche (es. "Naked 689cc")
4. Clicca su **"Salva"**

💡 **Suggerimenti**:
- Il nome del modello deve essere univoco
- La marca deve essere selezionata dalla lista (se non esiste, creala prima nella sezione "Marche")
- Usa la descrizione per specificare cilindrata, anno, versione, ecc.

### Selezione Marca con Ricerca Intelligente
Quando inserisci la marca:
1. Clicca sul campo "Marca"
2. Inizia a digitare (es. "Yam")
3. Appariranno suggerimenti con le marche che contengono quel testo
4. Clicca sulla marca desiderata per selezionarla
5. Il campo si compilerà automaticamente

### Cercare un Modello
1. Usa la barra di ricerca in alto
2. Digita il nome del modello o della marca
3. La ricerca filtra sia per nome modello che per marca

### Modificare un Modello
1. Clicca sull'icona della **matita** (✏️)
2. Modifica i campi desiderati
3. Clicca su **"Salva"**

### Eliminare un Modello
1. Clicca sull'icona del **cestino** (🗑️)
2. Conferma l'eliminazione

⚠️ **IMPORTANTE**: Un modello può essere eliminato **solo se non ha preventivi associati**.

---

## 📋 Gestione Preventivi

I preventivi sono le proposte di vendita che crei per i tuoi clienti.

### Visualizzazione Lista Preventivi
Nella sezione "Preventivi" trovi:
- **Intestazione** con titolo
- **Barra di ricerca**
- **Pulsanti**:
  - "Nuovo Preventivo"
  - "Stampa per Cliente" (🖨️)
- **Tabella preventivi** con le colonne:
  - Cliente
  - Data
  - Marca
  - Modello
  - Note
  - Azioni (✏️ Modifica, 🗑️ Elimina)

### Creare un Nuovo Preventivo
1. Clicca sul pulsante **"Nuovo Preventivo"**
2. Si aprirà una finestra modale
3. Compila i campi obbligatori:

   **Cliente**:
   - Inizia a digitare il nome del cliente
   - Appariranno suggerimenti dalla lista clienti
   - Clicca sul cliente desiderato per selezionarlo

   **Data**:
   - Clicca sul campo data
   - Seleziona la data dal calendario
   - Di default viene proposta la data odierna

   **Marca**:
   - Inizia a digitare il nome della marca
   - Seleziona dalla lista a tendina

   **Modello**:
   - Dopo aver selezionato la marca, inizia a digitare il nome del modello
   - Verranno mostrati **solo i modelli della marca selezionata**
   - Seleziona il modello desiderato

4. **Campo opzionale**:
   - **Note**: Aggiungi annotazioni, specifiche, condizioni speciali, ecc.

5. Clicca su **"Salva"** per creare il preventivo

💡 **Suggerimenti**:
- Assicurati di aver creato prima il cliente nella sezione "Clienti"
- La selezione del modello dipende dalla marca scelta (prima scegli la marca, poi il modello)
- Usa le note per informazioni importanti: prezzo proposto, condizioni, accessori, ecc.

### Autocomplete Intelligente
L'applicazione usa un sistema di ricerca intelligente:
- Mentre digiti, i risultati si filtrano automaticamente
- La ricerca è case-insensitive (non distingue maiuscole/minuscole)
- Puoi cercare usando parti del nome (es. "yam" trova "Yamaha")

### Cercare un Preventivo
1. Usa la barra di ricerca
2. Digita qualsiasi informazione: nome cliente, marca, modello
3. La tabella si filtra in tempo reale

### Modificare un Preventivo
1. Clicca sull'icona della **matita** (✏️)
2. Modifica i campi nella finestra modale
3. Clicca su **"Salva"**

### Eliminare un Preventivo
1. Clicca sull'icona del **cestino** (🗑️)
2. Conferma l'eliminazione
3. Il preventivo verrà rimosso definitivamente

### Stampa per Cliente
Questa funzione permette di stampare un report completo di tutti i preventivi raggruppati per cliente.

**Come usarla**:
1. Clicca sul pulsante **"Stampa per Cliente"** (🖨️)
2. Si aprirà l'anteprima di stampa del browser
3. Verifica i dati mostrati:
   - Intestazione con dati aziendali (indirizzo, P.IVA)
   - Preventivi raggruppati per cliente
   - Per ogni cliente:
     - Nome, telefono, email
     - Lista dei preventivi con data, marca, modello, note
4. Seleziona:
   - **Stampa**: per stampare su carta
   - **Salva come PDF**: per salvare in digitale
   - **Annulla**: per chiudere senza stampare

💡 **Suggerimenti**:
- Usa questa funzione per report mensili o per archiviazione
- Il PDF può essere inviato via email ai clienti
- Controlla sempre l'anteprima prima di stampare

---

## 👤 Gestione Utenti

Questa sezione permette di gestire gli account che possono accedere al sistema.

### Visualizzazione Lista Utenti
Nella sezione "Utenti" trovi:
- **Intestazione** con titolo
- **Barra di ricerca**
- **Pulsante "Nuovo Utente"**
- **Tabella utenti** con le colonne:
  - Nome Utente
  - Azioni (✏️ Modifica, 🗑️ Elimina)

### Creare un Nuovo Utente
1. Clicca sul pulsante **"Nuovo Utente"**
2. Compila i campi:
   - **Nome Utente**: Scegli un nome univoco (es. "LucaVerdi")
     - Minimo 3 caratteri
     - Usa solo lettere e numeri (no spazi)
   - **Password**: Inserisci una password sicura
     - Minimo 8 caratteri
     - Deve contenere:
       - Almeno una lettera minuscola (a-z)
       - Almeno una lettera maiuscola (A-Z)
       - Almeno un numero (0-9)
     - Esempio valido: "Password123"
     - 💡 Clicca sull'icona dell'occhio per mostrare/nascondere la password
3. Clicca su **"Salva"**

💡 **Suggerimenti per password sicure**:
- Usa una combinazione di lettere, numeri e caratteri speciali
- Non usare parole comuni o dati personali
- Cambia la password periodicamente
- Non condividere mai la tua password

### Cercare un Utente
1. Usa la barra di ricerca
2. Digita il nome utente
3. La tabella si filtra automaticamente

### Modificare un Utente
1. Clicca sull'icona della **matita** (✏️)
2. Nella finestra modale puoi modificare:
   - **Nome Utente**: Cambia il nome di login
   - **Password**: Lascia vuoto per mantenere la password attuale, oppure inseriscine una nuova
3. Clicca su **"Salva"**

⚠️ **ATTENZIONE**: 
- Se modifichi il **tuo** nome utente, verrai disconnesso automaticamente
- Dovrai effettuare nuovamente il login con il nuovo nome utente

### Eliminare un Utente
1. Clicca sull'icona del **cestino** (🗑️)
2. Conferma l'eliminazione

⚠️ **LIMITAZIONI**:
- **Non puoi eliminare l'ultimo utente rimasto** nel sistema (ci deve sempre essere almeno un utente)
- Se elimini il **tuo** account, verrai disconnesso immediatamente

---

## 🔧 Funzionalità Aggiuntive

### Sistema di Notifiche
L'applicazione mostra notifiche temporanee in alto a destra per informarti su:
- ✅ **Successo**: Operazioni completate (es. "Cliente salvato con successo")
- ⚠️ **Avvisi**: Informazioni importanti
- ❌ **Errori**: Problemi o operazioni non riuscite
- ℹ️ **Informazioni**: Messaggi generali

Le notifiche scompaiono automaticamente dopo qualche secondo.

### Sincronizzazione Tempo Reale
L'applicazione usa WebSocket per aggiornamenti in tempo reale:
- Se un altro utente crea/modifica/elimina un dato, le tue tabelle si aggiornano automaticamente
- Non devi ricaricare la pagina per vedere le modifiche

### Persistenza dei Dati
- **Sessione salvata**: L'ultima sezione visitata viene ricordata
- **Auto-login**: Se chiudi e riapri il browser, rimani connesso
- Per sicurezza, usa sempre il pulsante "Esci" quando hai finito

### Responsive Design
L'applicazione funziona su:
- 💻 **Desktop**: Visualizzazione completa con sidebar sempre visibile
- 📱 **Tablet**: Menu hamburger per la sidebar
- 📱 **Smartphone**: Interfaccia ottimizzata per schermi piccoli

### Accessibilità
- ⌨️ Puoi navigare usando la tastiera (Tab, Enter, Esc)
- 🔍 Tutte le funzioni di ricerca filtrano in tempo reale
- 📝 I form validano i dati prima dell'invio

---

## ❓ Risoluzione Problemi

### Non riesco ad accedere
**Problema**: Errore di login

**Soluzioni**:
1. Verifica di aver inserito il nome utente e la password corretti
2. Controlla se la password distingue maiuscole/minuscole
3. Assicurati di avere connessione internet
4. Prova a ricaricare la pagina (F5 o Ctrl+R)
5. Contatta l'amministratore per reimpostare la password

### La pagina non si carica
**Problema**: Schermata bianca o errore di connessione

**Soluzioni**:
1. Verifica la tua connessione internet
2. Ricarica la pagina (F5)
3. Svuota la cache del browser (Ctrl+Shift+Canc)
4. Prova con un browser diverso
5. Contatta l'amministratore di sistema

### Non vedo i dati aggiornati
**Problema**: Le tabelle non si aggiornano

**Soluzioni**:
1. Ricarica la sezione cliccando nuovamente sul menu
2. Ricarica completamente la pagina (F5)
3. Verifica la connessione internet
4. Controlla se ci sono notifiche di errore

### Non riesco a eliminare un elemento
**Problema**: Messaggio di errore durante l'eliminazione

**Cause comuni**:
- **Cliente**: Ha preventivi associati → elimina prima i preventivi
- **Marca**: Ha modelli collegati → elimina prima i modelli o cambiali marca
- **Modello**: Ha preventivi associati → elimina prima i preventivi
- **Utente**: È l'ultimo utente rimasto → impossibile eliminare

**Soluzione**: Elimina prima gli elementi dipendenti, poi riprova

### La ricerca non funziona
**Problema**: Filtro/ricerca non mostra risultati

**Soluzioni**:
1. Verifica di aver digitato correttamente
2. Controlla se ci sono filtri attivi da rimuovere
3. Prova a cancellare tutto e digitare nuovamente
4. Ricarica la sezione

### Il menu mobile non si apre
**Problema**: Su smartphone/tablet il menu non appare

**Soluzioni**:
1. Clicca sull'icona hamburger (☰) in alto a sinistra
2. Ricarica la pagina
3. Verifica che JavaScript sia abilitato nel browser

### Disconnessione improvvisa
**Problema**: Vieni riportato alla pagina di login

**Cause**:
- Hai eliminato o modificato il tuo account utente
- La sessione è scaduta
- Hai fatto logout da un'altra scheda/finestra

**Soluzione**: Effettua nuovamente il login

---

## 📞 Supporto

Per assistenza tecnica o domande:
- 📧 Contatta l'amministratore di sistema
- 📖 Consulta questa guida
- 🐛 Segnala eventuali bug o malfunzionamenti

---

## ✅ Checklist Operazioni Quotidiane

### Inizio Giornata
- [ ] Effettua il login
- [ ] Verifica nuovi clienti da ricontattare (🔔)
- [ ] Controlla preventivi in sospeso

### Gestione Cliente
- [ ] Aggiungi nuovo cliente
- [ ] Imposta data passaggio e ricontatto se necessario
- [ ] Crea preventivo associato

### Gestione Preventivo
- [ ] Seleziona cliente esistente
- [ ] Scegli marca e modello
- [ ] Aggiungi note con dettagli importanti
- [ ] Salva preventivo

### Fine Giornata
- [ ] Stampa report preventivi per archivio
- [ ] Verifica clienti da ricontattare domani
- [ ] Esegui logout sicuro

---

## 🎓 Consigli per l'Uso Ottimale

### Organizzazione Dati
1. **Clienti**: Inserisci sempre telefono ed email per contatti facili
2. **Note preventivi**: Usa le note per prezzi, accessori, condizioni speciali
3. **Date**: Imposta sempre la data passaggio per tracking clienti
4. **Ricontatti**: Usa la flag "Ricontatto Cliente" per follow-up

### Ricerche Efficienti
1. Usa poche lettere per trovare rapidamente (es. "yam" invece di "yamaha")
2. Filtra per data passaggio per vedere solo clienti di un periodo specifico
3. Combina ricerca testuale e filtri per risultati precisi

### Backup e Sicurezza
1. Stampa periodicamente i report come backup cartaceo
2. Non condividere mai le tue credenziali
3. Esegui sempre il logout su computer condivisi
4. Cambia la password regolarmente

### Workflow Consigliato
```
NUOVO CLIENTE → CREA MARCA (se nuova) → CREA MODELLO (se nuovo) → CREA PREVENTIVO → STAMPA REPORT
```

---

## 📊 Riepilogo Comandi Rapidi

| Azione | Pulsante/Icona |
|--------|----------------|
| Nuovo elemento | ➕ Pulsante "Nuovo..." |
| Modifica | ✏️ Icona matita |
| Elimina | 🗑️ Icona cestino |
| Cerca | 🔍 Barra di ricerca |
| Stampa | 🖨️ "Stampa per Cliente" |
| Logout | 🚪 Pulsante "Esci" |
| Menu mobile | ☰ Hamburger icon |
