/* globals describe, test, expect */
import db from './index';

describe('db util', () =>
  test('should return an array as results of query', async() => {
    const sql = 'SELECT * FROM "Users" WHERE email = $1';
    const { rows } = await db.query(sql, ['nul@bitbucket.com']);
    expect(Array.isArray(rows)).toBe(true);
  })
);
