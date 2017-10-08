'use strict';

/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

const userCtrlStub = {
  index: 'userCtrl.index',
  destroy: 'userCtrl.destroy',
  me: 'userCtrl.me',
  update: 'userCtrl.update',
  create: 'userCtrl.create',
  forgotPassword: 'userCtrl.forgotPassword',
  upsert: 'userCtrl.upsert'
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
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
const userIndex = proxyquire('./index', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './user.controller': userCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('User API Router:', () => {
  it('should return an express router instance', done => {
    userIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/users', () => {
    it('should verify admin role and route to user.controller.index', done => {
      routerStub.get.withArgs('/', 'authService.hasRole.teacher', 'userCtrl.index').should.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/users/me', () => {
    it('should be authenticated and route to user.controller.me', done => {
      routerStub.get.withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me').should.to.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users', () => {
    it('should route to user.controller.create', done => {
      routerStub.post.withArgs('/', 'userCtrl.create').should.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users/forgotpassword', () => {
    it('should route to user.controller.forgotPassword', done => {
      routerStub.post.withArgs('/forgotpassword', 'userCtrl.forgotPassword').should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should be authenticated and route to user.controller.update', done => {
      routerStub.put.withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.update').should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/users/:id/admin', () => {
    it('should be authenticated and route to user.controller.upsert', done => {
      routerStub.put.withArgs('/:id/admin', 'authService.hasRole.teacher', 'userCtrl.upsert').should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should verify admin role and route to user.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy').should.have.been.calledOnce;
      done();
    });
  });
});
