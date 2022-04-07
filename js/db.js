let mysql = require('mysql');
const db = mysql.createConnection({
    host: 'dd-finder.cncoqjx0rdhm.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'l;kasdn4t&$fa;',
    database: 'dd-finder'
});

db.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

const dbQuery = function dbQuery(sql, callback) {
    db.query(sql, function (err, result, fields) {
        if(err) {
            db.destroy();
            throw err;
        } else {
            console.log(result);
            callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
            })
        }
    })
}

module.exports = {
    dbQuery
}