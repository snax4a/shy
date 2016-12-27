'use strict';

var app = require('../..');
import request from 'supertest';

describe('Newsletter API:', () => {
  describe('POST /api/newsletter', () => {
    var response = '';

    beforeEach(done => {
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
    it('should send response thanking the user for subscribing to the newsletter', () => {
      expect(response).to.equal('Thanks for subscribing to our newsletter.');
    });
  });
});
