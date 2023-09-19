// 1] base - dalla documentazione:

// CONFIGURAZIONE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBIBG_SUBzgeTO_c1OextDMYpYplCIiQME", // Chiave API per l'autenticazione
    authDomain: "test-firebase-with-jquery.firebaseapp.com", // Dominio di autenticazione
    projectId: "test-firebase-with-jquery", // ID del progetto
    storageBucket: "test-firebase-with-jquery.appspot.com", // Bucket di storage
    messagingSenderId: "146895456879", // ID mittente per le notifiche
    appId: "1:146895456879:web:c700a00efb160ef4ad1b9a" // ID dell'applicazione
};

// INIZIALIZZAZIONE DELL'APP FIREBASE CON LA CONFIGURAZIONE
const app = firebase.initializeApp(firebaseConfig);

// INIZIALIZZAZIONE DEL DATABASE FIRESTORE
const db = firebase.firestore(app);

// OTTENERE L'ELENCO DEI CONTATTI DAL DATABASE
async function getCities(db) {
    const contactsCol = db.collection('contacts'); // Ottenere la collezione 'contacts'
    const contactSnapshot = await contactsCol.get(); // Ottenere lo snapshot dei documenti
    const contactList = contactSnapshot.docs.map(doc => doc.data()); // Mappare i dati dei documenti
    return contactList; // Restituire l'elenco dei contatti
}

// ---------------------------------------------------------------------------------------------------

// 2] altre funzioni CRUD + Detail:

// INSERIRE UN NUOVO CONTATTO NEL DATABASE
async function addContact(db, name, email, phone) {
    const contactsCol = db.collection('contacts'); // Ottenere la collezione 'contacts'
    await contactsCol.add({ name, email, phone }); // Aggiungere un nuovo documento con i dati del contatto
}

// MODIFICA IL CONTATTO SUL DATABASE
async function editContact(contact) {
    document.getElementById('contact-form').style.display = 'none'; // Nascondi il form di Inserimento dati

    // Crea il markup HTML del modulo di modifica come stringa
    const editFormHTML = `
        <br>
        <form id="edit-form">
            <label for="new-name">Nuovo Nome:</label>
            <input type="text" id="new-name" value="${contact.name}" required><br>
            <label for="new-email">Nuova Email:</label>
            <input type="email" id="new-email" value="${contact.email}" required><br>
            <label for="new-phone">Nuovo Telefono:</label>
            <input type="tel" id="new-phone" value="${contact.phone}" required><br>
            <input type="submit" value="Salva Modifiche">
        </form>
    `;

    // Aggiungi il markup HTML del modulo di modifica al corpo del documento
    document.body.innerHTML += editFormHTML;

    // Ottieni l'elemento del modulo di modifica
    const editForm = document.getElementById('edit-form');

    // Aggiungi un listener per la sottomissione del modulo
    editForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Ottieni i nuovi valori dai campi del modulo
        const newName = document.getElementById('new-name').value;
        const newEmail = document.getElementById('new-email').value;
        const newPhone = document.getElementById('new-phone').value;

        // Verifica se tutti i campi sono stati compilati
        if (newName && newEmail && newPhone) {
            // Ottieni un riferimento alla collezione 'contacts' nel database
            const contactsCol = db.collection('contacts');
            // Interroga il documento del contatto da aggiornare
            const contactDoc = await contactsCol.where('name', '==', contact.name).get();
            const contactRef = contactDoc.docs[0].ref;

            // Aggiorna il documento del contatto con i nuovi valori
            await contactRef.update({ name: newName, email: newEmail, phone: newPhone });
            
            // Aggiorna i contatti visualizzati
            await displayContacts();
        }

        // Rimuovi il modulo di modifica dalla pagina
        editForm.remove();

        document.getElementById('contact-form').style.display = 'block'; // Mostra il form di Inserimento dati
        window.location.reload() // Aggiorno la pagina (altrimenti non vedo le modifica in modo diretto, ma devo prima fare un ulteriore operazione di inserimento dati)
    });
}

// ELIMINA IL CONTATTO DAL DATABASE
async function deleteContact(contact) {
    const contactsCol = db.collection('contacts'); // Ottieni il riferimento alla collezione 'contacts' nel database
    const contactDoc = await contactsCol.where('name', '==', contact.name).get(); // Cerca il documento con il nome del contatto passato come argomento
    const contactRef = contactDoc.docs[0].ref; // Ottieni il riferimento al documento trovato
    await contactRef.delete(); // Elimina il documento
    await displayContacts(); // Visualizza nuovamente i contatti dopo l'eliminazione
}

// ************************
// DETTAGLIO DEL CONTATTO
function viewContactDetails(contact) {
    alert(`Nome: ${contact.name}\nEmail: ${contact.email}\nTelefono: ${contact.phone}`);
}

// ---------------------------------------------------------------------------------------------------

// 3] funzioni di visualizazione:

// VISUALIZZARE I CONTATTI NELLA PAGINA
async function displayContacts() {
    const contacts = await getCities(db); // Ottenere l'elenco dei contatti
    const contactsList = document.getElementById('contacts-list'); // Ottenere l'elemento HTML della lista dei contatti
    contactsList.innerHTML = ''; // Pulire la lista prima di aggiungere gli elementi
    
    // ************************
    contacts.forEach(contact => {
        const listItem = document.createElement('li'); // Creare un elemento di lista
        listItem.textContent = `${contact.name}: ${contact.email}, ${contact.phone}`; // Impostare il testo dell'elemento di lista
        
        // Aggiungi pulsante di modifica
        const editButton = document.createElement('button');
        editButton.textContent = 'Modifica';
        editButton.addEventListener('click', () => editContact(contact));
        
        // Aggiungi pulsante di eliminazione
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Elimina';
        deleteButton.addEventListener('click', () => deleteContact(contact));
        
        // Aggiungi il pulsante "Visualizza Dettagli"
        const viewButton = document.createElement('button');
        viewButton.textContent = 'Visualizza Dettagli';
        viewButton.addEventListener('click', () => viewContactDetails(contact));
        
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        listItem.appendChild(viewButton);
        
        contactsList.appendChild(listItem); // Aggiungere l'elemento di lista alla lista dei contatti
    });
    
}

// CHIAMATA PER VISUALIZZARE I CONTATTI
displayContacts();

// ---------------------------------------------------------------------------------------------------

// 4] gestione dati:

// FORM: MODULO DI INSERIMENTO DATI

// document.addEventListener('DOMContentLoaded', function() {
const contactForm = document.getElementById('contact-form'); // Ottenere il modulo di inserimento dati

// Aggiungere un event listener per l'invio del modulo
contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenire il comportamento predefinito del modulo
    
    // Ottenere i valori inseriti nel modulo
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    await addContact(db, name, email, phone); // Aggiungere il nuovo contatto al database
    contactForm.reset(); // Azzerare il modulo dopo l'inserimento
    
    // Aggiornare la visualizzazione dei contatti
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = ''; // Svuotare la lista dei contatti
    await displayContacts(); // Aggiornare la visualizzazione dei contatti
});
// });