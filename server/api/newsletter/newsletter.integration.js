'use strict';

var app = require('../..');
import request from 'supertest';

describe('Newsletter API:', function() {
  describe('POST /api/newsletter/subscribe', function() {
    var newsletters;

    beforeEach(function(done) {
      request(app)
        .post('/api/newsletter/subscribe')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newsletters = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(newsletters).to.be.instanceOf(Array);
    });
  });
});
