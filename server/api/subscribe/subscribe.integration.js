'use strict';

var app = require('../..');
import request from 'supertest';

describe('Subscribe API:', function() {
  describe('GET /api/subscribe', function() {
    var subscribes;

    beforeEach(function(done) {
      request(app)
        .get('/api/subscribe')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          subscribes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(subscribes).to.be.instanceOf(Array);
    });
  });
});
