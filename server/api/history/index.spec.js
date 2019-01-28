/* globals jest, describe, test, expect */
import express from 'express';
const routerStub = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

const authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

const historyCtrlStub = {
  index: 'historyCtrl.index',
  create: 'historyCtrl.create',
  update: 'historyCtrl.update',
  destroy: 'historyCtrl.destroy'
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

jest.mock('./history.controller', () => historyCtrlStub);

// require the index with our stubbed out modules
const historyIndex = require('./index.js');

describe('History API Router:', () => {
  test('should return an express router instance', done => {
    expect(historyIndex.default).toBe(routerStub);
    done();
  });

  describe('GET /api/history/:id', () => {
    test('should route to history.controller.index', done => {
      expect(
        routerStub.get.withArgs('/:id', 'authService.hasRole.teacher', 'asyncWrapper.historyCtrl.index')
      ).have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/history/:id', () => {
    test(
      'should be authenticated and route to history.controller.create',
      done => {
        expect(
          routerStub.post.withArgs('/', 'authService.hasRole.teacher', 'asyncWrapper.historyCtrl.create')
        ).have.been.calledOnce;
        done();
      }
    );
  });

  describe('PUT /api/history/:id', () => {
    test(
      'should be authenticated and route to history.controller.update',
      done => {
        expect(
          routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.historyCtrl.update')
        ).have.been.calledOnce;
        done();
      }
    );
  });

  describe('DELETE /api/history/:id', () => {
    test(
      'should verify admin role and route to history.controller.destroy',
      done => {
        expect(
          routerStub.delete.withArgs('/:id', 'authService.hasRole.teacher', 'asyncWrapper.historyCtrl.destroy')
        ).have.been.calledOnce;
        done();
      }
    );
  });
});
