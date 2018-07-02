/* global describe, it, after */
'use strict';

import app from '../..';
import { User } from '../../sqldb';
import request from 'supertest';

describe('Newsletter API:', () => {
  describe('POST /api/newsletter', () => {
    let newSubscriber = {
      email: 'nul@bitbucket.com'
    };

    it('should send response thanking the user for subscribing to the newsletter', () =>
      request(app)
        .post('/api/newsletter')
        .send(newSubscriber)
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(res => {
          let response = res.text.toString();
          response.should.equal('Thanks for subscribing to our newsletter.');
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
  });
});
