'use strict';

var app = require('../..');
import request from 'supertest';

describe('Order API:', function() {
  describe('POST /api/order/place', function() {
    var orders;

    beforeEach(function(done) {
      request(app)
        .post('/api/order/place')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(orders).to.be.instanceOf(Array);
    });
  });
});
