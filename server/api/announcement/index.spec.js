/* globals sinon, describe, it */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();
const asyncMiddleware = require('../../middleware/async-middleware'); // only wrap async functions

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

const authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

const announcementCtrlStub = {
  index: 'announcementCtrl.index',
  upsert: 'announcementCtrl.upsert',
  destroy: 'announcementCtrl.destroy'
};

// require the index with our stubbed out modules
const announcementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './announcement.controller': announcementCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Announcement API Router:', function() {
  it('should return an express router instance', function(done) {
    announcementIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/announcement', function() {
    it('should route to announcement.controller.index', function(done) {
      routerStub.get.withArgs('/', 'announcementCtrl.index')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/announcement/:id', function() {
    it('should be authenticated and route to announcement.controller.upsert', function(done) {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'announcementCtrl.upsert')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/announcement/:id', function() {
    it('should verify admin role and route to announcement.controller.destroy', function(done) {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'announcementCtrl.destroy')
        .should.have.been.calledOnce;
      done();
    });
  });
});
