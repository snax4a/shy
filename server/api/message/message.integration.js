/* global describe, beforeEach, it, expect, after */
'use strict';

import app from '../..';
import request from 'supertest';
import { User } from '../../sqldb';

describe('Message API:', function() {
  describe('POST /api/message', function() {
    let response = '';

    beforeEach(function(done) {
      request(app)
        .post('/api/message')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'jdoe@gmail.com',
          question: 'This is a question',
          optOut: false
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .end((err, res) => {
          if(err) return done(err);
          response = res.text;
          done();
        });
    });

    it('should send response thanking the user for submitting a question or comment', function() {
      expect(response).to.equal('Thanks for submitting your question or comment. We will respond shortly.');
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
