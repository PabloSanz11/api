const mysql = require('mysql');
const util = require('util');
const data = require('./middleware/data');

const pool = mysql.createPool(app.use(data));

pool.query = util.promisify(pool.query);
module.exports = pool;