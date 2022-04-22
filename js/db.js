let mysql = require('mysql2');
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

const dbQuery = async function dbQuery(sql) {
    const results = await db.promise().query(sql)
    // db.end()
    db.end(function(err) {
      if(err) {
        return console.error(err)
      }
      console.log('Connenction Ended')
    })
    return results[0];
}


module.exports = {
    dbQuery
}