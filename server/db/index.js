import config from '../config/environment';
import { native as pg } from 'pg';

const pool = new pg.Pool({
  max: 10, // default
  connectionString: config.pg.uri
});

export default {
  query: (text, params) => pool.query(text, params)
};
