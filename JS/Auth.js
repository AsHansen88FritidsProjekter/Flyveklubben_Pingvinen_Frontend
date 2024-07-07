function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:9090/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Login successful:', data);
            // Handle login success, such as saving the token or redirecting the user
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



function signup() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('role').value.split(',');

    fetch('http://localhost:9090/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Signup successful:', data);
            // Handle signup success
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function signout() {
    // Assuming signout does not need body data, only removes the token on server side
    fetch('http://localhost:9090/api/auth/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Signout successful:', data);
            // Handle signout, e.g., clearing local session data or cookies
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
