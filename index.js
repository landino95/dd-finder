const express = require('express');
const api = require('./api');
// const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const path = require('path');
// const session = require('express-session');

// const { auth } = require('express-openid-connect');
// const { requiresAuth } = require('express-openid-connect');

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.SECRET,
//   baseURL: 'http://localhost:3000/dev/',
//   clientID: 'W38JI33CdSvcuVl2ADnuc9YQjQ1tfKYD',
//   issuerBaseURL: 'https://dev-f3w-ohau.us.auth0.com'
// };
const app = express();
// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

// app.use(awsServerlessExpressMiddleware.eventContext());
app.use(express.json());

app.get('/user-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/user.html'));
});
app.get('/group-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/group.html'));
});
app.get('/character-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/character.html'));
});
app.get('/posts-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/posts.html'));
});
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/search.html'));
});
app.get('/create-group', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/create-group.html'));
});
app.get('/create-char', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/create-char.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/home.html'));
});

app.post('/auth', api.authorize);

app.get('/groups', api.getAllGroups);
app.get('/groups/:id', api.getGroup);
app.post('/joinGroup', api.joinGroup);
// app.get('/groupCharacters/:id', api.getGroupChars);
// app.get('/groups/posts/:id', api.getGroupPosts);
app.post('/createGroup', api.createGroup);
app.post('/updateGroup', api.updateGroup);
app.delete('/group/:id', api.deleteGroup);

app.post('/createChar', api.createChar);
app.post('/updateChar', api.updateChar);
app.get('/character/:id', api.getChar);
app.delete('/character/:id', api.deleteChar);

// app.get('/post/:id', api.getPost);
// app.post('/createPost', api.createPost);
app.get('/comments/:id', api.getComments);
app.post('/likes', api.likes);
app.post('/comments', api.writeComments);

app.get('/user/:id', api.getUser);
// app.get('/userChars/:id', api.getUserChars);
// app.get('/userGroups/:id', api.getUserGroups);
module.exports = app;