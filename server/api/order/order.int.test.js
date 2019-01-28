/* global describe, beforeAll, test, expect, afterAll */

import app from '../../app';
import { destroyUser } from '../user/user.controller';

import request from 'supertest';

describe('Order API:', () => {
  describe('POST /api/order', () => {
    let confirmation;

    beforeAll(done =>
      request(app)
        .post('/api/order')
        .send({
          nonceFromClient: 'fake-valid-no-billing-address-nonce',
          cartItems: [
            {
              id: 1,
              name: 'One class pass',
              price: 10, // Intentionally falsified price that should be overwritten automatically
              quantity: 2
            }
          ],
          instructions: 'One for John and one for Jane.',
          gift: true,
          sendVia: 'Mail',
          purchaser: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'leta@schoolhouseyoga.com',
            phone: '412-555-1212'
          },
          recipient: {
            firstName: 'Jane',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'Pittsburgh',
            state: 'PA',
            zipCode: '15222',
            email: 'john.doe@bitbucket.com',
            phone: '724-555-1212'
          }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          confirmation = res.body;
          done();
        })
    );

    // Delete test users
    afterAll(() => destroyUser('email', 'john.doe@bitbucket.com'));

    test('should return a confirmation with contact info that matches submitted', () => {
      const { firstName, lastName } = confirmation.customer;
      expect(firstName).toBe('John');
      expect(lastName).toBe('Doe');
    });
  });
});
