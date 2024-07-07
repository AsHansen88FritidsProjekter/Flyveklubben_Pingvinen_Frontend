const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const app = express();
app.use(express.json());

const JWT_SECRET = 'bezKoderSecretKey';

// Middleware to simulate user roles from JWT
const jwtCheck = expressJwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth'
});

const roleCheck = (roles) => (req, res, next) => {
    const userRoles = req.auth.roles;
    const hasRole = roles.some(role => userRoles.includes(role));
    if (hasRole) {
        next();
    } else {
        res.status(403).send('Access Denied');
    }
};

app.get('/api/test/all', (req, res) => {
    res.send('Public Content.');
});

app.get('/api/test/user', jwtCheck, roleCheck(['USER', 'MODERATOR', 'ADMIN']), (req, res) => {
    res.send('User Content.');
});

app.get('/api/test/mod', jwtCheck, roleCheck(['MODERATOR']), (req, res) => {
    res.send('Moderator Board.');
});

app.get('/api/test/admin', jwtCheck, roleCheck(['ADMIN']), (req, res) => {
    res.send('Admin Board.');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
