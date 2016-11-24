'use strict';

var app = require('../..');
import request from 'supertest';

describe('Order API:', function() {
  describe('POST /api/order', function() {
    var orders;

    beforeEach(function(done) {
      request(app)
        .post('/api/order')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(orders).to.be.instanceOf(Array);
    });
  });
});

/*
  describe('POST /api/things', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/things')
        .send({
          name: 'New Thing',
          info: 'This is the brand new thing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      expect(newThing.name).to.equal('New Thing');
      expect(newThing.info).to.equal('This is the brand new thing!!!');
    });
  });
  */
