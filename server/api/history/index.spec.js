/* globals sinon, describe, it */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const historyCtrlStub = {
  index: 'historyCtrl.index',
  create: 'historyCtrl.create',
  update: 'historyCtrl.update',
  destroy: 'historyCtrl.destroy'
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
  post: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
const historyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './history.controller': historyCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('History API Router:', () => {
  it('should return an express router instance', done => {
    historyIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/history/:id', () => {
    it('should route to history.controller.index', done => {
      routerStub.get.withArgs('/:id', 'authService.hasRole.teacher', 'historyCtrl.index')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/history/:id', () => {
    it('should be authenticated and route to history.controller.create', done => {
      routerStub.post.withArgs('/', 'authService.hasRole.teacher', 'historyCtrl.create')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/history/:id', () => {
    it('should be authenticated and route to history.controller.update', done => {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'historyCtrl.update')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/history/:id', () => {
    it('should verify admin role and route to history.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'historyCtrl.destroy')
        .should.have.been.calledOnce;
      done();
    });
  });
});
