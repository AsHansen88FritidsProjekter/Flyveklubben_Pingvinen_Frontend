const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock database tables for users and roles
let users = [];
let roles = [{ id: 1, name: 'ROLE_USER' }, { id: 2, name: 'ROLE_ADMIN' }, { id: 3, name: 'ROLE_MODERATOR' }];

// Passport local strategy for user login
passport.use(new LocalStrategy(
    function(username, password, done) {
        const user = users.find(u => u.username === username);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    }
));

app.post('/api/auth/signin', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Authentication failed', error: info });
        }
        const userRoles = user.roles.map(role => role.name);
        const token = jwt.sign({ id: user.id, username: user.username, roles: userRoles }, 'SECRET_KEY', { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).json({ id: user.id, username: user.username, email: user.email, roles: userRoles });
    })(req, res);
});

app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: 'Error: Username is already taken!' });
    }
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ message: 'Error: Email is already in use!' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const userRoles = role ? roles.filter(r => role.includes(r.name)) : [roles.find(r => r.name === 'ROLE_USER')];

    const newUser = { id: users.length + 1, username, email, password: hashedPassword, roles: userRoles };
    users.push(newUser);

    res.status(200).json({ message: 'User registered successfully!' });
});

app.post('/api/auth/signout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: "You've been signed out!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
