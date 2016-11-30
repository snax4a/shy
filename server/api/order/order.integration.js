'use strict';

const app = require('../..');
import request from 'supertest';

describe('Order API:', function() {
  describe('POST /api/order', function() {
    let confirmation;

    beforeEach(function(done) {
      request(app)
        .post('/api/order')
        .send({
          cartItems: [
            {
              id: 3,
              name: 'One card pass',
              price: 15,
              quantity: 1
            }
          ],
          forSomeoneElse: false,
          instructions: 'Test instructions',
          methodToSend: 'Apply credit to recipient\'s account (default)',
          paymentInfo: {
            ccCSC: 656,
            ccExpMonth: 12,
            ccExpYear: 2020,
            ccNumber: '4111111111111111'
          },
          purchaser: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'Pittsburgh',
            state: 'PA',
            zipCode: '15222',
            email: 'jdoe@gmail.com',
            phone: '412-555-1212'
          },
          recipient: {
            firstName: 'Basyl',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'Pittsburgh',
            state: 'PA',
            zipCode: '15222',
            email: 'jdoe@gmail.com',
            phone: '412-555-1212'
          }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          //console.log('RES', res.body);
          if(err) {
            return done(err);
          }
          confirmation = res.body;
          done();
        });
    });

    it('should respond with a JSON confirmation', function() {
      expect(confirmation.purchaser.firstName).to.equal('John');
      expect(confirmation.purchaser.lastName).to.equal('Doe');
    });
  });
});

/*
  describe('POST /api/things', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/things')
        .send({
          name: 'New Thing',
          info: 'This is the brand new thing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      expect(newThing.name).to.equal('New Thing');
      expect(newThing.info).to.equal('This is the brand new thing!!!');
    });
  });
  */
