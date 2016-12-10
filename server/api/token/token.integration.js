'use strict';

var app = require('../..');
import request from 'supertest';

describe('Token API:', function() {
  describe('GET /api/token', function() {
    var tokens;

    beforeEach(function(done) {
      request(app)
        .get('/api/token')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          tokens = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(tokens).to.be.instanceOf(Array);
    });
  });
});
