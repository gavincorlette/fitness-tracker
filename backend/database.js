const {Pool} = require('pg');

const pool = new Pool({
  user: 'fitness_user',
  host: 'localhost',
  database: 'fitness_db',
  password: 'fitness_password',
  port: 5432,
});

module.exports = pool;
