const dbQuery = require('./js/db');
const getUser = async function (req, res) {
    const id = req.params.id;

    const sql = `SELECT * FROM users WHERE user_id = ${id};`
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
};
const getUserChars = async function(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM characters WHERE user_id = ${id};`
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
        console.error(error);
    }
}
const getUserGroups = async function(req, res) {
    const id = req.params.id;
        const sql =  `select characters.char_name, characters.char_id, characters.group_id, users.user_name, users.email, player_groups.group_name
                from characters
            inner join player_groups on player_groups.group_id = characters.group_id
            inner join users on users.user_id = characters.user_id where users.user_id=${id}`;
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
        console.error(error);
    }
}
const getChar = async function (req, res) {
    const id = req.params.id;
    const sql = `SELECT characters.char_name, characters.race, characters.class, characters.strength, characters.dexterity, characters.constitution, characters.intelligence, characters.wisdom, characters.charisma, player_groups.group_name, player_groups.group_id, users.user_id, users.user_name
                FROM characters
                INNER JOIN player_groups ON player_groups.group_id=characters.group_id
                INNER JOIN users ON users.user_id=characters.user_id where characters.char_id=${id}`;
    try {
        const result = await dbQuery.dbQuery(sql);
        console.log(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
};
const getGroups = async function (req, res) {
    const id = req.params.id;
    console.log(id)
    // const sql = `SELECT player_groups.group_name, player_groups.description, player_groups.genre, player_groups.level, player_groups.dm, player_groups.play_type, player_groups.style, player_groups.created_on, characters.char_name, characters.char_id
// FROM player_groups
// INNER JOIN characters ON player_groups.group_id=characters.group_id where player_groups.group_id=${id};`;
    const sql = `SELECT * FROM player_groups where group_id = ${id};`
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}

const getGroupChars = async function(req, res) {
    const id = req.params.id;
    console.log(id)
    const sql = `SELECT char_id, char_name FROM characters WHERE group_id = ${id}`;
    try {
        const result = await dbQuery.dbQuery(sql);
        console.log(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}

const getGroupPosts = async function(req, res) {
    const id = req.params.id;
    console.log(id)
    const sql = `SELECT * FROM posts WHERE group_id = ${id}`;
    try {
        const result = await dbQuery.dbQuery(sql);
        if(result)
            return res.send(result);
        return res.send('No Posts')
    } catch (error) {
       console.error(error);
    }
}

const getPost = async function(req, res) {
    const id = req.params.id;
    const sql = `select posts.text, posts.annc_id, posts.group_id, posts.title, player_groups.group_name
                from posts
                inner join player_groups on posts.group_id = player_groups.group_id where posts.annc_id=${id};`;
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}

const getComments = async function(req, res) {
    const id = req.params.id;
    const sql = `select comments.comment_id, comments.likes, comments.text, comments.annc_id, comments.group_id, comments.parent_comm, comments.user_id, users.user_name
from comments
inner join posts on posts.annc_id = comments.annc_id
inner join users on users.user_id = comments.user_id where posts.annc_id=${id};`;
    try {
        const result = await dbQuery.dbQuery(sql);
        console.log(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}
const writeComments = async function(res, res) {
    const data = req.body;
    const sql = `insert into comments (text, char_id, group_id, annc_id, parent_comm, likes) values ("${data.text}", ${data.charId}, ${data.groupId}, ${data.anncId}, ${data.parentId}, ${data.likes});`;
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}
const likes = async function(req, res) {
    const data = req.body;
    const sql = `update comments set likes = ${data.likes} where comment_id = ${data.id};`;
    try {
        const result = await dbQuery.dbQuery(sql);
        res.send(result);
    } catch (error) {
       console.error(error);
    }
}
const joinGroup = async function(req, res) {
    const charId = req.body.charId;
    const groupId = req.body.groupId;
    console.log(charId, groupId)
    const sql = `UPDATE characters set group_id = ${groupId} where char_id = ${charId}`;
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
        console.error(error);
    }
}
const getAllGroups = async function(req, res) {
    const sql = `SELECT player_groups.group_id, player_groups.description, player_groups.group_name, player_groups.genre, player_groups.level, player_groups.play_type, player_groups.style, users.user_name 
                FROM player_groups
                INNER JOIN users 
                ON users.user_id = player_groups.dm;`;
    try {
        const result = await dbQuery.dbQuery(sql);
        console.log(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}
const createGroup = async function(req, res) {
    console.log(req.body)
    const data = req.body;
    const sql = `INSERT INTO player_groups (description, group_name, genre, level, dm, play_type, style, created_on) values ("${data.description}", "${data.groupName}", "${data.genre}", "${data.level}", ${data.dm}, "${data.playStyle}", "${data.playType}", "${data.createdOn}");`
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result)
    } catch (error) {
        console.error(error);        
    }
}

const createChar = async function(req, res) {
    const data = req.body;
    const sql = `INSERT INTO characters (user_id, race, class, strength, dexterity, constitution, intelligence, wisdom, charisma, char_name) values ("${data.userId}", "${data.race}", "${data.charClass}", "${data.strength}", "${data.dexterity}", "${data.constitution}", "${data.intelligence}", "${data.wisdom}", "${data.charisma}", "${data.charName}");`
    try {
        const result = await dbQuery.dbQuery(sql);
        return res.send(result);
    } catch (error) {
       console.error(error);
    }
}
const authorize = async function(req, res) {
    let username = req.body.username;
	let password = req.body.password;
    try {
        if (username && password) {
            const sql = `SELECT * FROM users WHERE user_name = "${username}" AND password = "${password}"`
            const result = await dbQuery.dbQuery(sql);
            console.log(result)
            if (result.length > 0) {
                // Authenticate the user
                req.session.loggedin = true;
                req.session.username = username;
                // Redirect to home page
                console.log(req.session)
                res.redirect('/dev/search');
            } else {
                res.send('Incorrect Username and/or Password!');
            }			
            res.end();
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    } catch (error) {
        console.error(error)
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
   getAllGroups,
   createGroup,
   createChar,
   authorize,
   joinGroup,
   getUserChars,
   getUserGroups
}