/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Attendance } from '../../sqldb';

let attendance;
let buildAttendance = function() {
  attendance = Attendance.build({
    userId: 1,
    attended: '2001-05-21T13:00:00.000-04:00',
    location: 'Squirrel Hill',
    classTitle: 'Test class',
    teacher: 'Koontz, Leta.'
  });
  return attendance;
};

describe('Attendance Model', function() {
  before(function() {
    // Sync and clear purchases before testing
    return Attendance.sync().then(function() {
      return Attendance.destroy({ where: { classTitle: 'Test class' } });
    });
  });

  beforeEach(function() {
    buildAttendance();
  });

  afterEach(function() {
    return Attendance.destroy({ where: { classTitle: 'Test class' } });
  });

  describe('#userId', function() {
    it('should fail when saving without a user ID', function(done) {
      attendance.userId = undefined;
      expect(attendance.save()).to.be.rejected;
      done();
    });
  });

  describe('#attended', function() {
    it('should fail when saving without an attendance date', function(done) {
      attendance.attended = undefined;
      expect(attendance.save()).to.be.rejected;
      done();
    });
  });

  describe('#location', function() {
    it('should fail when saving without a location', function(done) {
      attendance.location = undefined;
      expect(attendance.save()).to.be.rejected;
      done();
    });
  });

  describe('#classTitle', function() {
    it('should fail when saving without a purchase method', function(done) {
      attendance.classTitle = undefined;
      expect(attendance.save()).to.be.rejected;
      done();
    });
  });

  describe('#teacher', function() {
    it('should fail when saving without a teacher', function(done) {
      attendance.teacher = undefined;
      expect(attendance.save()).to.be.rejected;
      done();
    });
  });
});
