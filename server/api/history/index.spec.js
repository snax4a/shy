/* globals sinon, describe, it */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  get: sinon.spy(),
  post: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
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

// require the index with our stubbed out modules
const historyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../auth/auth.service': authServiceStub,
  '../../middleware/async-wrapper': asyncWrapperStub,
  './history.controller': historyCtrlStub
});

describe('History API Router:', function() {
  it('should return an express router instance', function(done) {
    historyIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/history/:id', function() {
    it('should route to history.controller.index', function(done) {
      routerStub.get.withArgs('/:id', 'authService.hasRole.teacher', 'asyncWrapper.historyCtrl.index')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/history/:id', function() {
    it('should be authenticated and route to history.controller.create', function(done) {
      routerStub.post.withArgs('/', 'authService.hasRole.teacher', 'asyncWrapper.historyCtrl.create')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/history/:id', function() {
    it('should be authenticated and route to history.controller.update', function(done) {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.historyCtrl.update')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/history/:id', function() {
    it('should verify admin role and route to history.controller.destroy', function(done) {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.teacher', 'asyncWrapper.historyCtrl.destroy')
        .should.have.been.calledOnce;
      done();
    });
  });
});
