/* globals beforeAll, expect, describe, test */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Schedule API:', () => {
  let newScheduleItemID;
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

  // schedule.controller.js:upsert
  describe('PUT /api/schedule/:id', () => {
    let newScheduleItem = {
      _id: 0,
      location: 'Test',
      day: 1,
      title: 'Yoga 1',
      teacher: 'Jane Doe',
      startTime: '2019-01-01T09:00', // date is ignored
      endTime: '2019-01-01T10:30', // date is ignored
      canceled: false
    };

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/schedule/0')
        .expect(401, done)
    );

    test('should upsert the schedule item when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/schedule/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newScheduleItem)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newScheduleItemID = res.body._id;
          expect(newScheduleItemID).toBeGreaterThan(0);
        })
    );
  });

  // schedule.controller.js:index
  describe('GET /api/schedule', () => {
    let schedules;

    beforeAll(done =>
      request(app)
        .get('/api/schedule')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) done(err);
          schedules = res.body;
          done();
        })
    );

    test('should respond with JSON array', () => {
      expect(Array.isArray(schedules)).toBe(true);
    });
  });

  // schedule.controller.js:destroy
  describe('DELETE /api/schedule/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/schedule/${newScheduleItemID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/schedule/${newScheduleItemID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
