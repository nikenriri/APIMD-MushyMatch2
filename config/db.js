const mysql = require('mysql');
const db = mysql.createPool({
    host: "34.101.59.135",
    user: "mushymatch",
    password: "mushymatch",
    database: "database_mushymatch"
});

// conn.getConnection((err) => {
//     if (err) throw err
//     console.log('DB Connected')
// });

exports.db = db;
