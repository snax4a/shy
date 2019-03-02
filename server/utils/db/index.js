import session from 'express-session';
import { native as pgNative } from 'pg';
import ConnectPgSimple from 'connect-pg-simple';
import config from '../../config/environment';

const pgNativePool = new pgNative.Pool({
  max: 10, // default
  connectionString: config.pg.uri
});

// Persist Express sessions in PostgreSQL
const PgSession = new ConnectPgSimple(session);
const store = new PgSession({
  pgNativePool,
  tableName: 'sessions'
});

//import { to as copyTo } from 'pg-copy-streams';


export default {
  query: (sql, params) => pgNativePool.query(sql, params),
  store,
  toCsv: async(res, sql) => {
    const copyTo = require('pg-copy-streams').to;
    const { Client } = require('pg');
    const client = new Client({
      connectionString: config.pg.uri
    });
    await client.connect();
    const stream = client.query(copyTo(`COPY (${sql}) TO STDOUT WITH CSV HEADER;`));
    stream.on('error', async err => {
      console.error(err);
      await client.end();
    });
    stream.pipe(res);
    stream.on('end', async() => {
      res.end();
      return await client.end();
    });
  }
};
