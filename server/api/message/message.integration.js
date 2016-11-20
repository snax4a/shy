'use strict';

var app = require('../..');
import request from 'supertest';

describe('Message API:', function() {
  describe('GET /api/message', function() {
    var messages;

    beforeEach(function(done) {
      request(app)
        .get('/api/message')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          messages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(messages).to.be.instanceOf(Array);
    });
  });
});
