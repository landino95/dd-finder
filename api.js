const dbQuery = require('./js/db');
const getUser = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    const sql =  `select characters.char_name, characters.char_id, characters.group_id, users.user_name, users.email, player_groups.group_name
                from characters
            inner join player_groups on player_groups.group_id = characters.group_id
            inner join users on users.user_id = characters.user_id where users.user_id=${id}`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
};
const getChar = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    const sql = `SELECT characters.char_name, characters.race, characters.class, characters.strength, characters.dexterity, characters.constitution, characters.intelligence, characters.wisdom, characters.charisma, player_groups.group_name, player_groups.group_id, users.user_id, users.user_name
                FROM characters
                INNER JOIN player_groups ON player_groups.group_id=characters.group_id
                INNER JOIN users ON users.user_id=characters.user_id where characters.char_id=${id}`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
};
const getGroups = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    const sql = `SELECT player_groups.group_name, player_groups.description, player_groups.genre, player_groups.level, player_groups.dm, player_groups.play_type, player_groups.style, player_groups.created_on, characters.char_name, characters.char_id
                FROM player_groups
                INNER JOIN characters ON player_groups.group_id=characters.group_id where player_groups.group_id=${id};`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        responsr.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }    
}

const getGroupChars = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    const sql = `SELECT char_id, name FROM characters WHERE group_id = ${id}`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}

const getGroupPosts = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    const sql = `SELECT * FROM posts WHERE group_id = ${id}`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}

const getPost = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    console.log(id)
    const sql = `select posts.text, posts.annc_id, posts.group_id, posts.title, player_groups.group_name
                from posts
                inner join player_groups on posts.group_id = player_groups.group_id where posts.annc_id=${id};`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}

const getComments = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const id = event.pathParameters.id;
    const sql = `select comments.comment_id, comments.likes, comments.text, comments.annc_id, comments.group_id, comments.parent_comm, characters.char_name
from comments
inner join posts on posts.annc_id = comments.annc_id
inner join characters on characters.user_id = comments.user_id where posts.annc_id=${id};`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}
const writeComments = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const data = JSON.parse(event.body)
    console.log(data)
    console.log(typeof(data.text))
    const sql = `insert into comments (text, char_id, group_id, annc_id, parent_comm, likes) values ("${data.text}", ${data.charId}, ${data.groupId}, ${data.anncId}, ${data.parentId}, ${data.likes});`;
    // const sql = 'insert into comments (text, char_id, group_id, annc_id, parent_comm, likes) values("Very exciting", 2, 1, 1, 1, 0);'
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}
const likes = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const data = JSON.parse(event.body)
    const sql = `update comments set likes = ${data.likes} where comment_id = ${data.id};`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}
const getAllGroups = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    const response = { statusCode: 200 };
    const data = JSON.parse(event.body)
    const sql = `SELECT player_groups.group_id, player_groups.description, player_groups.group_name, player_groups.genre, player_groups.level, player_groups.play_type, player_groups.style, users.user_name 
                FROM player_groups
                INNER JOIN users 
                ON users.user_id = player_groups.dm;`;
    try {
        dbQuery.dbQuery(sql, callback);
    } catch (error) {
       console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Query Failed',
            errorMsg: error.message,
            errorStack: error.stack
        }); 
    }
}

module.exports = {
   getChar,
   getUser,
   getGroups,
   getGroupChars,
   getGroupPosts,
   getPost,
   getComments,
   writeComments,
   likes,
   getAllGroups
}