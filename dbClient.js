// dbClient.js
const { Client } = require('pg');

function createDbClient(database = 'app_blog') {
  return new Client({
    user: 'postgres',
    host: 'localhost',
    database: database,
    password: '1234',
    port: 5432,
  });
}

module.exports = { createDbClient };