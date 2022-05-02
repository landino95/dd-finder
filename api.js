const dbQuery = require('./js/db');
const moment = require('moment');
const passwordHash = require('password-hash');
var randomstring = require("randomstring");

function end() {
    dbQuery.end(function(err) {
        if(err) {
            return console.error(err)
        }
        console.info('Connenction Ended')
    })
}

const getUser = async function (req, res) {
    // const id = req.params.id;
    const id = await cookieCheck(req, res);
    if(!id)
        return res.sendStatus(500);

    const userSql = `SELECT * FROM users WHERE user_id = ${id};`
    const charSql = `SELECT * FROM characters WHERE user_id = ${id};`
    const groupSql = `select characters.char_name, characters.char_id, characters.group_id, users.user_name, users.email, player_groups.group_name
                from characters
            inner join player_groups on player_groups.group_id = characters.group_id
            inner join users on users.user_id = characters.user_id where users.user_id=${id}`;
    try {
        const user = await dbQuery.dbQuery(userSql);
        const characters = await dbQuery.dbQuery(charSql);
        const groups = await dbQuery.dbQuery(groupSql);
        end();
        const result = user[0];
        result.characters = characters; 
        result.groups = groups;
        console.info(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
};

const getChar = async function (req, res) {
    const userId = await cookieCheck(req, res);
    console.log('user id', userId)
    if(!userId)
        return res.sendStatus(500);
    const id = req.params.id;
    const sql = `SELECT * FROM characters WHERE char_id = ${id};`;
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        console.info(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
};

const getGroup = async function (req, res) {
    const groupId = req.params.id;
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const groupSql = `SELECT * FROM player_groups where group_id = ${groupId};`;
    const charSql = `SELECT * FROM characters WHERE group_id = ${groupId}`;
    const userSql = `SELECT * FROM characters WHERE user_id = ${userId};`;
    const commentsSql = `select comments.comment_id, comments.title, comments.likes, comments.text, comments.parent_id, comments.group_id, comments.user_id, comments.created_on, users.user_name, player_groups.group_id
                from comments
                inner join users on users.user_id = comments.user_id 
                inner join player_groups on player_groups.group_id = comments.group_id where comments.group_id = ${groupId} `;
    // const commentsSql = 'SELECT * FROM comments;';
    try {
        const groups = await dbQuery.dbQuery(groupSql);
        const characters = await dbQuery.dbQuery(charSql);
        const user = await dbQuery.dbQuery(userSql);
        const comments = await dbQuery.dbQuery(commentsSql);
        end();
        let result = groups[0];
        result.characters = characters;
        result.user = user;
        result.comments = comments;
        console.info(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const getComments = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const id = req.params.id;
    const sql = `select comments.comment_id, comments.likes, comments.text, comments.annc_id, comments.group_id, comments.parent_comm, comments.user_id, users.user_name
from comments
inner join posts on posts.annc_id = comments.annc_id
inner join users on users.user_id = comments.user_id where posts.annc_id=${id};`;
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        console.info(result)
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const writeComments = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const data = req.body;
    const createdOn = moment().format('MMMM Do YYYY, h:mm')
    const sql = `insert into comments (title, text, user_id, group_id, parent_id, likes, created_on) values ("${data.title}","${data.text}", ${userId}, ${data.groupId}, ${data.parentId}, ${data.likes}, "${createdOn}");`;
    console.info(sql)
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        console.info(result);
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const likes = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const data = req.body;
    const sql = `update comments set likes = ${data.likes} where comment_id = ${data.id};`;
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        console.info(result);
        res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const joinGroup = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const charId = req.body.charId;
    const groupId = req.body.groupId;
    const sql = `UPDATE characters set group_id = ${groupId} where char_id = ${charId}`;
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        console.info(result);
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

const getAllGroups = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const sql = `SELECT player_groups.group_id, player_groups.description, player_groups.group_name, player_groups.genre, player_groups.level, player_groups.play_type, player_groups.style, users.user_name 
                FROM player_groups
                INNER JOIN users 
                ON users.user_id = player_groups.dm;`;
    try {
        const result = await dbQuery.dbQuery(sql);
        console.info(result)
        end();
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const createGroup = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    console.log(req.body)
    const data = req.body;
    const createdOn = moment().format('MMMM Do YYYY, h:mm')
    const sql = `INSERT INTO player_groups (description, group_name, genre, level, dm, play_type, style, created_on) values ("${data.description}", "${data.groupName}", "${data.genre}", "${data.level}", ${userId}, "${data.playStyle}", "${data.playType}", "${createdOn}");`
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        return res.send(result)
    } catch (error) {
        console.error(error);        
        return res.sendStatus(500);
    }
}

const updateGroup = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const data = req.body;
    // const userId = await cookieCheck(req, res);
    console.log(data)
    const sql = `UPDATE player_groups
                SET description="${data.description}", group_name="${data.group_name}",
                genre="${data.genre}", level="${data.level}", dm="${userId}",
                play_type="${data.play_type}", style="${data.play_style}"
                WHERE group_id = ${data.groupId};`
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        console.info(result)
        return res.send(result)
    } catch (error) {
        console.error(error);        
        return res.sendStatus(500);
    }
}

const createChar = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const data = req.body;
    // const userId = await cookieCheck(req, res);
    const sql = `INSERT INTO characters (user_id, race, class, strength, dexterity, constitution, intelligence, wisdom, charisma, char_name) values ("${userId}", "${data.race}", "${data.charClass}", "${data.strength}", "${data.dexterity}", "${data.constitution}", "${data.intelligence}", "${data.wisdom}", "${data.charisma}", "${data.charName}");`
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const updateChar = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const data = req.body;
    console.log(data)
    const sql = `UPDATE characters 
                SET race="${data.race}", class="${data.class}", strength=${data.strength}, dexterity=${data.dexterity}, constitution=${data.constitution}, intelligence=${data.intelligence}, wisdom=${data.wisdom}, charisma=${data.charisma}, char_name="${data.char_name}"
                WHERE char_id = ${data.charId}`
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        return res.send(result);
    } catch (error) {
       console.error(error);
        return res.sendStatus(500);
    }
}

const deleteGroup = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const id = req.params.id;
    const deleteGroupSql = `DELETE FROM player_groups WHERE group_id = ${id};`;
    const deleteComments = `DELETE FROM comments WHERE group_id = ${id};`;
    try {
        const group = await dbQuery.dbQuery(deleteGroupSql);
        const comments = await dbQuery.dbQuery(deleteComments);
        end();
        return res.send(group)
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

const deleteChar = async function(req, res) {
    const userId = await cookieCheck(req, res);
    if(!userId)
        return res.sendStatus(500);
    const id = req.params.id;
    const deleteChar = `DELETE FROM characters WHERE char_id = ${id};`;
    try {
        const char = await dbQuery.dbQuery(deleteChar);
        end();
        return res.send(char)
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

const authorize = async function(req, res) {
    let username = req.body.username;
	let password = req.body.password;
    let email = req.body.email;
    // console.log(email, password)
    let options = {
        maxAge: 1000 * 60 * 5, // would expire after 15 minutes
        // httpOnly: true
    }
    try {
        if (username && password) {
            const sql = `SELECT * FROM users WHERE user_name = "${username}";`;
            const result = await dbQuery.dbQuery(sql);
            if (result.length > 0) {
                return res.send(result[0]);
            } else {
                return res.send('Incorrect Username and/or Password!');
            }			
        } else if(email && password) {
            const sql = `SELECT * FROM users WHERE email = "${email}";`;
            const result = await dbQuery.dbQuery(sql);
            if (result.length > 0 && passwordHash.verify(password, result[0].password)) {
                const rand = randomstring.generate();
                const newCookie = await dbQuery.dbQuery(`UPDATE users SET cookie="${rand}" WHERE user_id = ${result[0].user_id};`);
                end();
                console.log(result)
                res.cookie('token', rand, options);
                return res.send('Valid');
            } else {
                // return res.send('Incorrect Username and/or Password!');
                return res.sendStatus(500);
            }
        } else {
            // return res.send('Please enter Username and Password!');
            return res.sendStatus(500);
        }
    } catch (error) {
        console.error(error)
    }
}

const register = async function(req, res) {
    const data = req.body;
    let password = passwordHash.generate(data.password);
    console.log(password);
    const rand = randomstring.generate();
    const sql = `INSERT INTO users (email, user_name, password, cookie)
                    values ("${data.email}", "${data.name}", "${password}", 
                    "${rand}");`;
    try {
        const result = await dbQuery.dbQuery(sql);
        end();
        res.cookie('token', rand, options);
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

const cookieCheck = async function(req, res) {
    console.log('token from headers', req.cookies['token'])
    try {
        const sql = `SELECT * FROM users WHERE cookie = "${req.cookies['token']}"`;
        const result = await dbQuery.dbQuery(sql);
        if(!result)
            return false;
        return result[0].user_id;
    } catch (error) {
        console.error(error);
    }
}

const logout = async function(req, res) {
    try {
       res.clearCookie('token');
       return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}
module.exports = {
    logout,
    authorize,
    register,
    getUser,
    likes,
    getComments,
    writeComments,
    getAllGroups,
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    createChar,
    getChar,
    updateChar,
    deleteChar
}