/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Announcement } from '../../sqldb';

let announcement;
let buildAnnouncement = function() {
  announcement = Announcement.build({
    section: 'Sunday, April 16th Class Schedule',
    title: 'East Libery School',
    description: 'all classes running as scheduled',
    expires: '2017-04-30T00:00:00.000-05:00',
  });
  return announcement;
};

describe('Announcement Model', function() {
  before(function() {
    // Sync and clear users before testing
    return Announcement.sync().then(function() {
      return Announcement.destroy({ where: { section: 'Sunday, April 16th Class Schedule' } });
    });
  });

  beforeEach(function() {
    buildAnnouncement();
  });

  afterEach(function() {
    return Announcement.destroy({ where: { section: 'Sunday, April 16th Class Schedule' } });
  });

  it('should begin with at least 4 announcements seeded', function() {
    expect(Announcement.findAll()).to.eventually.have.length.above(4);
  });

  describe('#section', function() {
    it('should fail when saving without a section', function(done) {
      announcement.section = '';
      expect(announcement.save()).to.be.rejected;
      done();
    });
  });

  describe('#title', function() {
    it('should fail when saving without a title', function(done) {
      announcement.title = '';
      expect(announcement.save()).to.be.rejected;
      done();
    });
  });

  describe('#description', function() {
    it('should fail when saving without a description', function(done) {
      announcement.description = '';
      expect(announcement.save()).to.be.rejected;
      done();
    });
  });

  describe('#expires', function() {
    it('should fail when saving without an expiration date', function(done) {
      announcement.expires = '';
      expect(announcement.save()).to.be.rejected;
      done();
    });
  });
});
