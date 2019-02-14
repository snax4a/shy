/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Workshop API:', () => {
  let newWorkshopID;
  let tokenAdmin;

  // Authenticate the administrator
  beforeAll(done =>
    request(app)
      .post('/auth/local')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        tokenAdmin = res.body.token;
        done();
      })
  );

  describe('POST /auth/local', () =>
    test('should authenticate the administrator and get token with length of 164', () =>
      expect(tokenAdmin).toHaveLength(164)
    )
  );

  // workshop.controller.js:upsert
  describe('POST /api/workshop/:id', () => {
    let newWorkshop = {
      _id: 0,
      title: 'Sample Workshop',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      imageId: null,
      expires: '2019-03-30T00:00:00+00:00',
      sections: [
        {
          title: 'Test Section',
          description: 'Test Section Description',
          nodate: false,
          start: '2019-03-29T22:30:00+00:00',
          expires: '2019-03-30T00:00:00+00:00',
          productId: 63,
          locationId: 3
        }
      ]
    };

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/workshop/0')
        .send(newWorkshop)
        .expect(401, done)
    );

    test('should upsert the workshop when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/workshop/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newWorkshop)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          // TODO: check imageId as well
          newWorkshopID = res.body._id;
          expect(newWorkshopID).toBeGreaterThan(0);
        })
    );
  });

  // workshop.controller.js:index
  describe('GET /api/workshop', () =>
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/workshop')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const workshops = res.body;
          expect(Array.isArray(workshops)).toBe(true);
        })
    )
  );

  // workshop.controller.js:destroy
  describe('DELETE /api/workshop/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/workshop/${newWorkshopID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/workshop/${newWorkshopID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
