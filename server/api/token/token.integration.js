'use strict';

var app = require('../..');
import request from 'supertest';

describe('Token API:', () => {
  describe('GET /api/token', () => {
    var token;

    beforeEach(function(done) {
      request(app)
        .get('/api/token')
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          token = res.body;
          done();
        });
    });

    it('should respond with a client token', () => {
      expect(token).to.have.length.above(1700);
    });
  });
});
