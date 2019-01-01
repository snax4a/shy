/* global describe, before, beforeEach, afterEach, it */

import { Schedule } from '../../sqldb';

let schedule;
let buildSchedule = () => {
  schedule = Schedule.build({
    location: 'Test',
    day: 1,
    title: 'Yoga 1',
    teacher: 'Leta Koontz',
    startTime: '09:00:00.000000',
    endTime: '10:30:00.000000',
    canceled: false
  });
  return schedule;
};

describe('Schedule Model', () => {
  before(() => // Sync and clear users before testing
    Schedule.sync().then(() => Schedule.destroy({ where: { location: 'Test' } })));

  beforeEach(() => {
    buildSchedule();
  });

  afterEach(() => Schedule.destroy({ where: { location: 'Test' } }));

  describe('#location', () => {
    it('should fail when saving without a location', () => {
      schedule.location = '';
      return schedule.save().should.eventually.be.rejected;
    });
  });

  describe('#day', () => {
    it('should fail when saving with a null day', () => {
      schedule.day = null;
      return schedule.save().should.eventually.be.rejected;
    });
  });

  describe('#title', () => {
    it('should fail when saving without a title', () => {
      schedule.title = '';
      return schedule.save().should.eventually.be.rejected;
    });
  });

  describe('#teacher', () => {
    it('should fail when saving without a teacher', () =>{
      schedule.teacher = '';
      return schedule.save().should.eventually.be.rejected;
    });
  });

  describe('#startTime', () => {
    it('should fail when saving without a startTime', () => {
      schedule.startTime = '';
      return schedule.save().should.eventually.be.rejected;
    });
  });

  describe('#endTime', () => {
    it('should fail when saving without an endTime', () => {
      schedule.endTime = '';
      return schedule.save().should.eventually.be.rejected;
    });
  });
});
