'use strict';

const app = require('../..');
import request from 'supertest';

describe('Order API:', () => {
  describe('POST /api/order', () => {
    let confirmation;

    beforeEach(done => {
      request(app)
        .post('/api/order')
        .send({
          cartItems: [
            {
              id: 1,
              name: 'One class pass',
              price: 10, // Intentionally falsified price that should be overwritten automatically
              quantity: 2
            }
          ],
          instructions: 'One for John and one for Jane.',
          isGift: true,
          sendVia: 'Mail',
          // Implement: get a dummy nonce to use
          purchaser: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@bitbucket.com',
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
          if(err) {
            return done(err);
          }
          confirmation = res.body;
          done();
        });
    });

    it('should respond with a JSON confirmation', () => {
      expect(confirmation.purchaser.firstName).to.equal('John');
      expect(confirmation.purchaser.lastName).to.equal('Doe');
    });
  });
});
