/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Location API:', () => {
  let newLocationID;
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

  // location.controller.js:upsert
  describe('PUT /api/location/:id', () => {
    let newLocation = {
      _id: 0,
      name: 'Location 1',
      address: '123 Main Street',
      city: 'Pittsburgh',
      state: 'PA',
      zipCode: '15217',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d759.2361528117804!2d-79.92352977282381!3d40.4322253626211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8834f1feef0d63d7%3A0xabc7eb0e7346a9b9!2sSchoolhouse+Yoga!5e0!3m2!1sen!2sus!4v1470020444130',
      street: 'https://www.google.com/maps/embed?pb=!1m0!3m2!1sen!2sus!4v1483899807219!6m8!1m7!1swJHnWEpmX-aUwvuR872N5Q!2m2!1d40.43231428860852!2d-79.92317164546498!3f129.08566511770485!4f-1.8504661311467885!5f2.299968626952992',
      directions: 'https://goo.gl/maps/YRkLw47EC8M2',
      review: 'https://www.google.com/search?q=Schoolhouse+Yoga%2C+Squirrel+Hill+Studio&oq=Schoolhouse+Yoga%2C+Squirrel+Hill+Studio&aqs=chrome..69i57.1516j0j1&sourceid=chrome&ie=UTF-8#q=Schoolhouse+Yoga,+Squirrel+Hill+Studio&rflfq=1&rlha=0&rllag=40446366,-79925061,1582&tbm=lcl&rldimm=12378120548147177913&tbs=lf_od:-1,lf_oh:-1,lf_pqs:EAE,lf:1,lf_ui:3&*&lrd=0x8834f1feef0d63d7:0xabc7eb0e7346a9b9,3,',
      note1: 'Our Squirrel Hill studio is located across the street from Eyetique, on the corner of Phillips and Murray Avenues.',
      note2: 'Free and metered parking spaces are available. There is a City of Pittsburgh parking lot located on Phillips Avenue.',
      active: true
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/location/0')
        .send(newLocation)
        .expect(401, done)
    );

    test('should upsert the location when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/location/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newLocation)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newLocationID = res.body._id;
          expect(newLocationID).toBeGreaterThan(0);
        })
    );
  });

  // location.controller.js:index
  describe('GET /api/location', () =>
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/location')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const locations = res.body;
          expect(Array.isArray(locations)).toBe(true);
        })
    )
  );

  // announcement.controller.js:destroy
  describe('DELETE /api/location/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/location/${newLocationID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/location/${newLocationID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
