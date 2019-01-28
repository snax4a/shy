/* globals sinon, describe, it, jest, test, expect */
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
  it('should return an express router instance', done => {
    announcementIndex.default.should.equal(routerStub);
    done();
  });

  describe('GET /api/announcement', () => {
    it('should route to announcement.controller.index', done => {
      routerStub.get.withArgs('/', 'asyncWrapper.controller.index')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/announcement/:id', () => {
    it('should be authenticated and route to announcement.controller.upsert', done => {
      routerStub.put.withArgs('/:id', 'auth.hasRole.admin', 'asyncWrapper.controller.upsert')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/announcement/:id', () => {
    it('should verify admin role and route to announcement.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'auth.hasRole.admin', 'asyncWrapper.controller.destroy')
        .should.have.been.calledOnce;
      done();
    });
  });
});
