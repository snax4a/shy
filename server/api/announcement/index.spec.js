'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var announcementCtrlStub = {
  index: 'announcementCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var announcementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './announcement.controller': announcementCtrlStub
});

describe('Announcement API Router:', function() {
  it('should return an express router instance', function() {
    expect(announcementIndex).to.equal(routerStub);
  });

  describe('GET /api/announcement', function() {
    it('should route to announcement.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'announcementCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
