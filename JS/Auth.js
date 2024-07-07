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
