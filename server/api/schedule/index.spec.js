/* globals jest, describe, test, expect */
import express from 'express';
const routerStub = {
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
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

describe('Schedule API Router:', () => {
  test('should return an express router instance', done => {
    expect(scheduleIndex.default).toBe(routerStub);
    done();
  });

  describe('GET /api/schedule', () => {
    test('should route to schedule.controller.index', done => {
      expect(routerStub.get.withArgs('/', 'asyncWrapper.scheduleCtrl.index')).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('PUT /api/schedule/:id', () => {
    test(
      'should be authenticated and route to schedule.controller.upsert',
      done => {
        expect(
          routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.scheduleCtrl.upsert')
        ).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  describe('DELETE /api/schedule/:id', () => {
    test(
      'should verify admin role and route to schedule.controller.destroy',
      done => {
        expect(
          routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.scheduleCtrl.destroy')
        ).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });
});
