/* globals sinon, jest, describe, test, it, expect */
import express from 'express';
const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

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

const asyncWrapperStub = method => `asyncWrapper.${method}`;

jest.mock(express, () => ({
  Router() {
    return routerStub;
  }
}));

jest.mock('../../auth/auth.service', () => authServiceStub);

jest.mock('../../middleware/async-wrapper', () => ({
  default: asyncWrapperStub
}));

jest.mock('./schedule.controller', () => scheduleCtrlStub);

// require the index with our stubbed out modules
const scheduleIndex = require('./index.js');

describe('Schedule API Router:', function() {
  it('should return an express router instance', done => {
    expect(scheduleIndex.default).toBe(routerStub);
    done();
  });

  describe('GET /api/schedule', function() {
    it('should route to schedule.controller.index', done => {
      expect(routerStub.get.withArgs('/', 'asyncWrapper.scheduleCtrl.index')).have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/schedule/:id', function() {
    it('should be authenticated and route to schedule.controller.upsert', done => {
      expect(
        routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.scheduleCtrl.upsert')
      ).have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/schedule/:id', function() {
    it('should verify admin role and route to schedule.controller.destroy', done => {
      expect(
        routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.scheduleCtrl.destroy')
      ).have.been.calledOnce;
      done();
    });
  });
});
