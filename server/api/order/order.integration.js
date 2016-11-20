'use strict';

var app = require('../..');
import request from 'supertest';

describe('Order API:', function() {
  describe('GET /api/order', function() {
    var orders;

    beforeEach(function(done) {
      request(app)
        .get('/api/order')
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
