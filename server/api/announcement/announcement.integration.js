'use strict';

/* globals describe, expect, it, beforeEach */

var app = require('../..');
import request from 'supertest';

describe('Announcement API:', function() {
  describe('GET /api/announcement', function() {
    var announcements;

    beforeEach(function(done) {
      request(app)
        .get('/api/announcement')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          announcements = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(announcements).to.be.instanceOf(Array);
    });
  });
});
