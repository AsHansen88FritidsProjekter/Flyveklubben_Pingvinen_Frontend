function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:9090/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Login successful:', data);
            fetchUserInfo();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function fetchUserInfo() {
    fetch('http://localhost:9090/api/test/currentUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Important to include credentials (cookies) in request
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User info:', data); // Log the data to verify it
            displayUserInfo(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.getElementById('signupButton').addEventListener('click', function() {
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const role = document.getElementById('role').value;

    // Basic validation
    if (!username || !email || !password || !role) {
        alert('All fields must be filled.');
        return;
    }

    const signUpRequest = {
        username: username,
        email: email,
        password: password,
        role: [role] // Ensure this is an array even if it's a single role
    };

    fetch('http://localhost:9090/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpRequest),
        credentials: 'include' // Include credentials if needed (cookies)
    })
        .then(response => {
            if (!response.ok) {
                // Parse and return the error message from response
                return response.json().then(err => {
                    throw new Error(`Network response was not ok: ${err.message || response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Signup successful:', data);
            alert('Signup successful!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`An error occurred during signup: ${error.message}`);
        });
});


function displayUserInfo(user) {
    // Ensure user object has the expected properties
    if (user && user.id && user.username && user.roles) {
        const roles = user.roles.map(role => role.name).join(', ');
        const userInfo = `ID: ${user.id}, Username: ${user.username}, Roles: ${roles}`;
        document.getElementById('userInfo').innerText = userInfo;
    } else {
        console.error('Invalid user data:', user);
        document.getElementById('userInfo').innerText = 'Invalid user data';
    }
}

function signout() {
    fetch('http://localhost:9090/api/auth/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Important to include credentials (cookies) in request
    })
        .then(response => response.json())
        .then(data => {
            console.log('Signout successful:', data);
            // Clear the displayed user info on signout
            document.getElementById('userInfo').innerText = 'User signed out';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
