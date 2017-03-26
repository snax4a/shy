/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Schedule } from '../../sqldb';

let schedule;
let buildSchedule = function() {
  schedule = Schedule.build({
    location: 'Test',
    day: 'Sunday',
    title: 'Yoga 1',
    teacher: 'Leta Koontz',
    startTime: '09:00:00.000000',
    endTime: '10:30:00.000000'
  });
  return schedule;
};

describe('Schedule Model', function() {
  before(function() {
    // Sync and clear users before testing
    return Schedule.sync().then(function() {
      return Schedule.destroy({ where: { location: 'Test' } });
    });
  });

  beforeEach(function() {
    buildSchedule();
  });

  afterEach(function() {
    return Schedule.destroy({ where: { location: 'Test' } });
  });

  describe('#location', function() {
    it('should fail when saving without a location', function(done) {
      schedule.location = '';
      expect(schedule.save()).to.be.rejected;
      done();
    });
  });

  describe('#day', function() {
    it('should fail when saving without a day', function(done) {
      schedule.day = undefined;
      expect(schedule.save()).to.be.rejected;
      done();
    });
  });

  describe('#title', function() {
    it('should fail when saving without a title', function(done) {
      schedule.title = '';
      expect(schedule.save()).to.be.rejected;
      done();
    });
  });

  describe('#teacher', function() {
    it('should fail when saving without a teacher', function(done) {
      schedule.teacher = '';
      expect(schedule.save()).to.be.rejected;
      done();
    });
  });

  describe('#startTime', function() {
    it('should fail when saving without a startTime', function(done) {
      schedule.startTime = '';
      expect(schedule.save()).to.be.rejected;
      done();
    });
  });

  describe('#endTime', function() {
    it('should fail when saving without an endTime', function(done) {
      schedule.endTime = '';
      expect(schedule.save()).to.be.rejected;
      done();
    });
  });
});
