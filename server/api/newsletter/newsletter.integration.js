/* global describe, beforeEach, it, expect */
'use strict';

var app = require('../..');
import request from 'supertest';

describe('Newsletter API:', function() {
  describe('POST /api/newsletter', function() {
    var response = '';

    beforeEach(function(done) {
      request(app)
        .post('/api/newsletter')
        .send({
          email: 'jdoe@gmail.com'
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
    it('should send response thanking the user for subscribing to the newsletter', function() {
      expect(response).to.equal('Thanks for subscribing to our newsletter.');
    });
  });
});
