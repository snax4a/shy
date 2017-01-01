/* global describe, beforeEach, it, expect */
'use strict';

const app = require('../..');
import request from 'supertest';

describe('Message API:', function() {
  describe('POST /api/message', function() {
    var response = '';

    beforeEach(function(done) {
      request(app)
        .post('/api/message')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'jdoe@gmail.com',
          question: 'This is a question',
          optout: false
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          response = res.text;
          done();
        });
    });

    it('should send response thanking the user for submitting a question or comment', function() {
      console.log('RESPONSE', response);
      expect(response).to.equal('Thanks for submitting your question or comment. We will respond shortly.');
    });
  });
});
