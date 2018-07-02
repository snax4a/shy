/* global describe, before, it, after */
'use strict';

import app from '../..';
import request from 'supertest';
import { User } from '../../sqldb';

describe('Message API:', () => {
  describe('POST /api/message', () => {
    let response = '';

    before(() =>
      request(app)
        .post('/api/message')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'nul@bitbucket.com',
          question: 'This is a question',
          optOut: false,
          role: 'student',
          provider: 'local'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(res => {
          response = res.text;
        })
    );

    // Delete test user
    after(() =>
      User.destroy({
        where: {
          email: 'jdoe@gmail.com'
        }
      })
    );

    it('should send response thanking the user for submitting a question or comment', () =>
      response.should.equal('Thanks for submitting your question or comment. We will respond shortly.'));
  });
});
