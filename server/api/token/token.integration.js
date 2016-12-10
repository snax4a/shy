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
        .expect('Content-Type', /json/) // Need to see whether it's going to be JSON
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          tokens = res.body;
          done();
        });
    });

    it('should respond with a client token', () => {
      expect(tokens).to.equal('Some client token'); // Fix later when I know what these look like
    });
  });
});
