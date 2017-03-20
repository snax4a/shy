/* global describe, it, expect, after */
'use strict';

import app from '../..';
import { User } from '../../sqldb';
import request from 'supertest';

describe('Newsletter API:', function() {
  describe('POST /api/newsletter', function() {
    it('should send response thanking the user for subscribing to the newsletter', function(done) {
      request(app)
        .post('/api/newsletter')
        .send({
          email: 'jdoe@gmail.com'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.text.toString()).to.equal('Thanks for subscribing to our newsletter.');
          done();
        });
    });

    // Delete test user
    after(function() {
      return User.destroy({
        where: {
          $or: [
            { email: 'jdoe@gmail.com' }
          ]
        }
      });
    });
  });
});
