document.addEventListener('DOMContentLoaded', function () {
    fetchContacts();
});

function fetchContacts() {
    const apiUrl = 'http://localhost:9090/api/contact/contactinfo';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayContactsEmail(data);
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
            alert('Failed to load contacts.');
        });
}

function displayContactsEmail(contacts) {
    const container = document.getElementById('contacts');
    container.innerHTML = ''; // Clear previous entries

    contacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.innerHTML = `
            <h3>${contact.firstname} ${contact.lastname}</h3>
            <p>Email: ${contact.email}</p>
            <p>Message: ${contact.message}</p>
        `;
        container.appendChild(contactDiv);
    });
}
