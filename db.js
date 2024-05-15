const Pool = require('pg').Pool;
const config = require('config');
const pool = new Pool({
    user: 'postgres',
    host: config.get('configDB.HOST'),
    database: 'bdprueba',
    password: '12345678',
    port: '5432'
})


module.exports = pool;