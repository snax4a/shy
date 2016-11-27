'use strict';

const app = require('../..');
import request from 'supertest';

describe('Message API:', function() {
  describe('POST /api/message', function() {
    var messages;

    beforeEach(function(done) {
      request(app)
        .post('/api/message')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          question: 'This is a question',
          optout: false
        })
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

    it('should respond an HTTP result of 200', function() {
      expect(messages).to.be.instanceOf(Array);
    });
  });
});
