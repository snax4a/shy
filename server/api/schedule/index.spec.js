'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var scheduleCtrlStub = {
  index: 'scheduleCtrl.index',
  upsert: 'scheduleCtrl.upsert',
  destroy: 'scheduleCtrl.destroy'
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
var scheduleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './schedule.controller': scheduleCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Schedule API Router:', function() {
  it('should return an express router instance', function() {
    expect(scheduleIndex).to.equal(routerStub);
  });

  describe('GET /api/schedule', function() {
    it('should route to schedule.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'scheduleCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/schedule/:id', function() {
    it('should be authenticated and route to schedule.controller.upsert', function(done) {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.admin', 'scheduleCtrl.upsert')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/schedule/:id', function() {
    it('should verify admin role and route to schedule.controller.destroy', function(done) {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'scheduleCtrl.destroy')
        ).to.have.been.calledOnce;
      done();
    });
  });
});
