/* globals sinon, describe, expect, it */
'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var announcementCtrlStub = {
  index: 'announcementCtrl.index',
  upsert: 'announcementCtrl.upsert',
  destroy: 'announcementCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var announcementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './announcement.controller': announcementCtrlStub,
  '../../auth/auth.service': authServiceStub
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

  describe('PUT /api/announcement/:id', function() {
    it('should be authenticated and route to announcement.controller.upsert', function(done) {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.admin', 'announcementCtrl.upsert')
      ).to.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/announcement/:id', function() {
    it('should verify admin role and route to announcement.controller.destroy', function(done) {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'announcementCtrl.destroy')
      ).to.have.been.calledOnce;
      done();
    });
  });
});
