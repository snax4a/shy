/* globals jest, describe, test, expect */
import express from 'express';
const routerStub = {
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
};

const userCtrlStub = {
  index: 'userCtrl.index',
  destroy: 'userCtrl.destroy',
  me: 'userCtrl.me',
  update: 'userCtrl.update',
  create: 'userCtrl.create',
  messageSend: 'userCtrl.messageSend',
  forgotPassword: 'userCtrl.forgotPassword',
  upsert: 'userCtrl.upsert',
  subscribe: 'userCtrl.subscribe',
  unsubscribe: 'userCtrl.unsubscribe'
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

jest.mock('./user.controller', () => userCtrlStub);

// require the index with our stubbed out modules
const userIndex = require('./index');

describe('User API Router:', () => {
  test('should return an express router instance', done => {
    expect(userIndex.default).toBe(routerStub);
    done();
  });

  describe('GET /api/user', () => {
    test('should verify admin role and route to user.controller.index', done => {
      expect(
        routerStub.get.withArgs('/', 'authService.hasRole.teacher', 'asyncWrapper.userCtrl.index')
      ).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('GET /api/user/me', () => {
    test('should be authenticated and route to user.controller.me', done => {
      expect(
        routerStub.get.withArgs('/me', 'authService.isAuthenticated', 'asyncWrapper.userCtrl.me')
      ).to.toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('POST /api/user', () => {
    test('should route to user.controller.create', done => {
      expect(routerStub.post.withArgs('/', 'asyncWrapper.userCtrl.create')).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('POST /api/user/message', () => {
    test('should route to user.controller.messageSend', done => {
      expect(routerStub.post.withArgs('/message', 'asyncWrapper.userCtrl.messageSend')).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('POST /api/user/forgotpassword', () => {
    test('should route to user.controller.forgotPassword', done => {
      expect(
        routerStub.post.withArgs('/forgotpassword', 'asyncWrapper.userCtrl.forgotPassword')
      ).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('PUT /api/user/:id', () => {
    test('should be authenticated and route to user.controller.update', done => {
      expect(
        routerStub.put.withArgs('/:id', 'authService.isAuthenticated', 'asyncWrapper.userCtrl.update')
      ).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('PUT /api/user/:id/admin', () => {
    test('should be authenticated and route to user.controller.upsert', done => {
      expect(
        routerStub.put.withArgs('/:id/admin', 'authService.hasRole.teacher', 'asyncWrapper.userCtrl.upsert')
      ).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('DELETE /api/user/:id', () => {
    test('should verify admin role and route to user.controller.destroy', done => {
      expect(
        routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.userCtrl.destroy')
      ).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('POST /api/user/subscribe', () => {
    test('should route to user.controller.subscribe', done => {
      expect(routerStub.post.withArgs('/subscribe', 'asyncWrapper.userCtrl.subscribe')).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('GET /api/user/unsubscribe/:email', () => {
    test('should route to user.controller.unsubscribe', done => {
      expect(
        routerStub.get.withArgs('/unsubscribe/:email', 'asyncWrapper.userCtrl.unsubscribe')
      ).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
