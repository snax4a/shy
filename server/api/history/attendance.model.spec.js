/* global describe, before, beforeEach, afterEach, it */

import { Attendance } from '../../sqldb';

let attendance;
let buildAttendance = () => {
  attendance = Attendance.build({
    UserId: 1,
    attended: '2001-05-21T13:00:00.000-04:00',
    location: 'Squirrel Hill',
    classTitle: 'Test class',
    teacher: 'Koontz, Leta'
  });
  return attendance;
};

describe('Attendance Model', () => {
  before(() => // Sync and clear purchases before testing
    Attendance.sync().then(() => Attendance.destroy({ where: { classTitle: 'Test class' } })));

  beforeEach(() => {
    buildAttendance();
  });

  afterEach(() => Attendance.destroy({ where: { classTitle: 'Test class' } }));

  describe('#userId', () => {
    it('should fail when saving without a user ID', () => {
      attendance.UserId = null;
      return attendance.save().should.eventually.be.rejected;
    });
  });

  describe('#attended', () => {
    it('should fail when saving without an attendance date', () => {
      attendance.attended = undefined;
      return attendance.save().should.eventually.be.rejected;
    });
  });

  describe('#location', () => {
    it('should fail when saving without a location', () => {
      attendance.location = undefined;
      return attendance.save().should.eventually.be.rejected;
    });
  });

  describe('#classTitle', () => {
    it('should fail when saving without a purchase method', () => {
      attendance.classTitle = undefined;
      return attendance.save().should.eventually.be.rejected;
    });
  });

  describe('#teacher', () => {
    it('should fail when saving without a teacher', () => {
      attendance.teacher = undefined;
      return attendance.save().should.eventually.be.rejected;
    });
  });
});
