/* global describe, beforeEach, expect, it */
'use strict';

var app = require('../..');
import request from 'supertest';

describe('Token API:', function() {
  describe('GET /api/token', function() {
    var token;

    beforeEach(function(done) {
      request(app)
        .get('/api/token')
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          token = res.text;
          done();
        });
    });

    it('should respond with a client token that is 1700 characters or more', function() {
      expect(token).to.have.length.above(1700);
    });
  });
});
