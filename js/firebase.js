// Definizione della configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBIBG_SUBzgeTO_c1OextDMYpYplCIiQME", // Chiave API per l'autenticazione
    authDomain: "test-firebase-with-jquery.firebaseapp.com", // Dominio di autenticazione
    projectId: "test-firebase-with-jquery", // ID del progetto
    storageBucket: "test-firebase-with-jquery.appspot.com", // Bucket di storage
    messagingSenderId: "146895456879", // ID mittente per le notifiche
    appId: "1:146895456879:web:c700a00efb160ef4ad1b9a" // ID dell'applicazione
};

// Inizializzazione dell'applicazione Firebase con la configurazione
const app = firebase.initializeApp(firebaseConfig);

// Inizializzazione del database Firestore
const db = firebase.firestore(app);

// Funzione asincrona per ottenere l'elenco dei contatti dal database
async function getCities(db) {
    const contactsCol = db.collection('contacts'); // Ottenere la collezione 'contacts'
    const contactSnapshot = await contactsCol.get(); // Ottenere lo snapshot dei documenti
    const contactList = contactSnapshot.docs.map(doc => doc.data()); // Mappare i dati dei documenti
    return contactList; // Restituire l'elenco dei contatti
}

// Funzione asincrona per visualizzare i contatti nella pagina
async function displayContacts() {
    const contacts = await getCities(db); // Ottenere l'elenco dei contatti
    const contactsList = document.getElementById('contacts-list'); // Ottenere l'elemento HTML della lista dei contatti
    contacts.forEach(contact => {
        const listItem = document.createElement('li'); // Creare un elemento di lista
        listItem.textContent = `${contact.name}: ${contact.email}, ${contact.phone}`; // Impostare il testo dell'elemento di lista
        contactsList.appendChild(listItem); // Aggiungere l'elemento di lista alla lista dei contatti
    });
}

// Chiamata alla funzione per visualizzare i contatti
displayContacts();

// ...

// Funzione asincrona per inserire un nuovo contatto nel database
async function addContact(db, name, email, phone) {
    const contactsCol = db.collection('contacts'); // Ottenere la collezione 'contacts'
    await contactsCol.add({ name, email, phone }); // Aggiungere un nuovo documento con i dati del contatto
}

// ...

document.addEventListener('DOMContentLoaded', function() {
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
});

// ...

