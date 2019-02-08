import db from '../../utils/db';

// Returns list of Products
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, name, price, active FROM products ORDER BY name;', []);
  return res.status(200).send(rows);
}

export async function activeProductsGet() {
  const { rows } = await db.query('SELECT _id, name, price FROM products WHERE active = true ORDER BY _id;', []);
  return rows;
}

// Returns list of active Products
export async function activeProducts(req, res) {
  const products = await activeProductsGet();
  return res.status(200).send(products);
}

export async function upsertProduct(product) {
  const { _id, name, price, active } = product;
  const isNew = _id === 0; // zero means INSERT
  let arrParams = [name, price, active];
  let sql;
  if(isNew) {
    sql = 'INSERT INTO products (name, price, active) VALUES ($1, $2, $3) RETURNING _id;';
  } else {
    sql = 'UPDATE products SET name = $2, price = $3, active = $4 WHERE _id = $1 RETURNING _id;';
    arrParams.unshift(_id);
  }
  const { rows } = await db.query(sql, arrParams);
  return rows[0]._id;
}

// Updates or creates product (admin-only)
export async function upsert(req, res) {
  const _id = await upsertProduct(req.body);
  return res.status(200).send({ _id });
}

// Deletes announcement (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM products WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Product ${_id} deleted.`});
}
