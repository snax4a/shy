// Centralize use of pg throughout project
import { Pool } from 'pg';
import config from '../../config/environment';

const pool = new Pool({ connectionString: config.pg.uri });
// Read https://node-postgres.com/features/pooling

// TODO: Call pool.end() within the pool.query callback or promise.
export default {
  query: (text, params) => pool.query(text, params)
  // .then
};
