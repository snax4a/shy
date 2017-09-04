'use strict';

/* globals before, describe, it, before */

import app from '../..';
import request from 'supertest';
import config from '../../config/environment';

describe('Schedule API:', () => {
  let newScheduleItemID;
  let tokenAdmin;

  // Authenticate the administrator
  before(() =>
    request(app)
      .post('/auth/local')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        tokenAdmin = res.body.token;
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
      startTime: '09:00:00.000000',
      endTime: '10:30:00.000000',
      canceled: false
    };

    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .put('/api/schedule/0')
        .set('authorization', 'Bearer BOGUS')
        .expect(401)
    );

    it('should upsert the schedule item when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/schedule/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newScheduleItem)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          newScheduleItemID = res.body._id;
          newScheduleItemID.should.be.above(0);
        })
    );
  });

  // schedule.controller.js:index
  describe('GET /api/schedule', () => {
    let schedules;

    before(() =>
      request(app)
        .get('/api/schedule')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          schedules = res.body;
        })
    );

    it('should respond with JSON array', () => {
      schedules.should.be.instanceOf(Array);
    });
  });

  // schedule.controller.js:destroy
  describe('DELETE /api/schedule/:id', () => {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .delete(`/api/schedule/${newScheduleItemID}`)
        .set('authorization', 'Bearer BOGUS')
        .expect(401)
    );

    it('should respond with a result code of 204 to confirm deletion when authenticated', () =>
      request(app)
        .delete(`/api/schedule/${newScheduleItemID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
    );
  });
});
