'use strict';

/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

const scheduleCtrlStub = {
  index: 'scheduleCtrl.index',
  upsert: 'scheduleCtrl.upsert',
  destroy: 'scheduleCtrl.destroy'
};

const authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
const scheduleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './schedule.controller': scheduleCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Schedule API Router:', () => {
  it('should return an express router instance', done => {
    scheduleIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/schedule', () => {
    it('should route to schedule.controller.index', done => {
      routerStub.get.withArgs('/', 'scheduleCtrl.index').should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/schedule/:id', () => {
    it('should be authenticated and route to schedule.controller.upsert', done => {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'scheduleCtrl.upsert').should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/schedule/:id', () => {
    it('should verify admin role and route to schedule.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'scheduleCtrl.destroy').should.have.been.calledOnce;
      done();
    });
  });
});
