/* globals sinon, describe, jest, test, expect */
import express from 'express';
const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

const authStub = {
  hasRole(role) {
    return `auth.hasRole.${role}`;
  }
};

const asyncWrapperStub = method => `asyncWrapper.${method}`;

const controllerStub = {
  index: 'controller.index',
  upsert: 'controller.upsert',
  destroy: 'controller.destroy'
};

jest.mock(express, () => ({
  Router() {
    return routerStub;
  }
}));

jest.mock('../../auth/auth.service', () => authStub);

jest.mock('../../middleware/async-wrapper', () => ({
  default: asyncWrapperStub
}));

jest.mock('./announcement.controller', () => controllerStub);

const announcementIndex = require('./index.js');

describe('Announcement API Router:', () => {
  test('should return an express router instance', done => {
    expect(announcementIndex.default).toBe(routerStub);
    done();
  });

  describe('GET /api/announcement', () => {
    test('should route to announcement.controller.index', done => {
      expect(routerStub.get.withArgs('/', 'asyncWrapper.controller.index')).have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/announcement/:id', () => {
    test(
      'should be authenticated and route to announcement.controller.upsert',
      done => {
        expect(
          routerStub.put.withArgs('/:id', 'auth.hasRole.admin', 'asyncWrapper.controller.upsert')
        ).have.been.calledOnce;
        done();
      }
    );
  });

  describe('DELETE /api/announcement/:id', () => {
    test(
      'should verify admin role and route to announcement.controller.destroy',
      done => {
        expect(
          routerStub.delete.withArgs('/:id', 'auth.hasRole.admin', 'asyncWrapper.controller.destroy')
        ).have.been.calledOnce;
        done();
      }
    );
  });
});
