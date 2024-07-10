function submitForm() {
    const form = document.getElementById('contactForm'); // Make sure your form has an ID of 'contactForm'
    const contactData = {
        firstname: form.elements['firstname'].value,
        lastname: form.elements['lastname'].value,
        email: form.elements['email'].value,
        message: form.elements['subject'].value
    };

    // API endpoint URL
    const apiUrl = 'http://localhost:9090/api/contact/contacts';

    // Fetch API to send the POST request
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Contact submitted successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit contact: ' + error.message);
        });
}
