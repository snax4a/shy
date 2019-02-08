/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Product API:', () => {
  let newProductID;
  let tokenAdmin;

  // Authenticate the administrator
  beforeAll(done =>
    request(app)
      .post('/auth/local')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        tokenAdmin = res.body.token;
        done();
      })
  );

  describe('POST /auth/local', () =>
    test('should authenticate the administrator and get token with length of 164', () =>
      expect(tokenAdmin).toHaveLength(164)
    )
  );

  // product.controller.js:upsert
  describe('PUT /api/product/:id', () => {
    let newProduct = {
      _id: 0,
      name: 'Product 1',
      price: 5,
      active: true
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/product/0')
        .send(newProduct)
        .expect(401, done)
    );

    test('should upsert the product when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/product/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newProduct)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newProductID = res.body._id;
          expect(newProductID).toBeGreaterThan(0);
        })
    );
  });

  // product.controller.js:index
  describe('GET /api/product', () =>
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/product')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const products = res.body;
          expect(Array.isArray(products)).toBe(true);
        })
    )
  );

  // announcement.controller.js:destroy
  describe('DELETE /api/product/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/product/${newProductID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/product/${newProductID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
