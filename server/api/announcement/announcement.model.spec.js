/* global describe, before, beforeEach, afterEach, it */

import { Announcement } from '../../utils/sqldb';

let announcement;
let buildAnnouncement = () => {
  announcement = Announcement.build({
    section: 'Sunday, April 16th Class Schedule',
    title: 'East Liberty School',
    description: 'all classes running as scheduled',
    expires: '2018-12-31T00:00:00.000-05:00',
  });
  return announcement;
};

describe('Announcement Model', () => {
  before(() => Announcement.sync()
    .then(() => Announcement.destroy({ where: { section: 'Sunday, April 16th Class Schedule' } })
    ));

  beforeEach(() => {
    buildAnnouncement();
  });

  afterEach(() => Announcement.destroy({ where: { section: 'Sunday, April 16th Class Schedule' } }));

  it('should begin with at least one announcement', () => Announcement.findAll().should.eventually.have.length.above(0));

  describe('#section', () => {
    it('should fail when saving without a section', () => {
      announcement.section = '';
      return announcement.save().should.be.rejected;
    });
  });

  describe('#title', () => {
    it('should fail when saving without a title', () => {
      announcement.title = '';
      return announcement.save().should.be.rejected;
    });
  });

  describe('#description', () => {
    it('should fail when saving without a description', () => {
      announcement.description = '';
      return announcement.save().should.be.rejected;
    });
  });

  describe('#expires', () => {
    it('should fail when saving without an expiration date', () => {
      announcement.expires = '';
      return announcement.save().should.be.rejected;
    });
  });
});
