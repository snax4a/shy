import session from 'express-session';
import { native as pg } from 'pg';
import ConnectPgSimple from 'connect-pg-simple';
import config from '../../config/environment';

const pool = new pg.Pool({
  max: 10, // default
  connectionString: config.pg.uri
});

// Persist Express sessions in PostgreSQL
const PgSession = new ConnectPgSimple(session);
const store = new PgSession({
  pool,
  tableName: 'sessions'
});

export default {
  query: (text, params) => pool.query(text, params),
  store
};
