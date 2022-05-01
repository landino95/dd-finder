const express = require('express');
const api = require('./api');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());


app.get('/user-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/user.html'));
});
app.get('/group-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/group.html'));
});
app.get('/character-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/character.html'));
});
// app.get('/posts-page', (req, res) => {
//     res.sendFile(path.join(__dirname, '/html/posts.html'));
// });
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/search.html'));
});
app.get('/create-group', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/create-group.html'));
});
app.get('/create-char', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/create-char.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/register.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/home.html'));
});
app.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'));
});

app.post('/auth', api.authorize);
app.post('/register', api.register);
app.post('/logout', api.logout);

app.get('/groups', api.getAllGroups);
app.get('/groups/:id', api.getGroup);
app.post('/joinGroup', api.joinGroup);
app.post('/createGroup', api.createGroup);
app.post('/updateGroup', api.updateGroup);
app.delete('/group/:id', api.deleteGroup);

app.post('/createChar', api.createChar);
app.post('/updateChar', api.updateChar);
app.get('/character/:id', api.getChar);
app.delete('/character/:id', api.deleteChar);

app.get('/comments/:id', api.getComments);
app.post('/likes', api.likes);
app.post('/comments', api.writeComments);

app.get('/user/:id', api.getUser);
module.exports = app;