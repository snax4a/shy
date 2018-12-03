// Centralize use of pg throughout project
import { Pool } from 'pg';

const pool = new Pool();

export default {
  query: (text, params) => pool.query(text, params)
};
