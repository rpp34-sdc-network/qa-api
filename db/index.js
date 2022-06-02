// const pg = require('pg');
const { Pool, Client } = require('pg')
const pool = new Pool({
    user: 'kylekk',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
  });


module.exports = pool;