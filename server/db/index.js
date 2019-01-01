import config from '../config/environment';

const { Pool } = require('pg').native;

const pool = new Pool({
  max: 10, // default
  connectionString: config.pg.uri
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
