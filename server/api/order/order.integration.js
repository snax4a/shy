/* global describe, before, it, after */

import app from '../..';
import { User } from '../../utils/sqldb';
import request from 'supertest';

describe('Order API:', function() {
  describe('POST /api/order', function() {
    let confirmation;

    before(() =>
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
          // Implement: get a dummy nonce to use
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
        .expect(res => {
          confirmation = res.body;
        })
    );

    // Delete test users
    after(() =>
      User.destroy({
        where: {
          email: 'john.doe@bitbucket.com'
        }
      })
    );

    it('should return a confirmation with contact info that matches submitted', () => {
      confirmation.customer.firstName.should.equal('John');
      confirmation.customer.lastName.should.equal('Doe');
    });
  });
});
