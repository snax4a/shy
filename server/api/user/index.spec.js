'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var userCtrlStub = {
  index: 'userCtrl.index',
  destroy: 'userCtrl.destroy',
  me: 'userCtrl.me',
  update: 'userCtrl.update',
  create: 'userCtrl.create',
  forgotPassword: 'userCtrl.forgotPassword',
  upsert: 'userCtrl.upsert'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userIndex = proxyquire('./index', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './user.controller': userCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('User API Router:', function() {
  it('should return an express router instance', function(done) {
    expect(userIndex).to.equal(routerStub);
    done();
  });

  describe('GET /api/users', function() {
    it('should verify admin role and route to user.controller.index', function(done) {
      expect(routerStub.get
        .withArgs('/', 'authService.hasRole.teacher', 'userCtrl.index')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/users/me', function() {
    it('should be authenticated and route to user.controller.me', function(done) {
      expect(routerStub.get
        .withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users', function() {
    it('should route to user.controller.create', function(done) {
      expect(routerStub.post
        .withArgs('/', 'userCtrl.create')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users/forgotpassword', function() {
    it('should route to user.controller.forgotPassword', function(done) {
      expect(routerStub.post
        .withArgs('/forgotpassword', 'userCtrl.forgotPassword')
        ).to.have.been.calledOnce;
      done();
    });
  });

  // Update to allow for teacher's role!
  describe('PUT /api/users/:id', function() {
    it('should be authenticated and route to user.controller.update', function(done) {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.update')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/users/:id/admin', function() {
    it('should be authenticated and route to user.controller.upsert', function(done) {
      expect(routerStub.put
        .withArgs('/:id/admin', 'authService.hasRole.admin', 'userCtrl.upsert')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/users/:id', function() {
    it('should verify admin role and route to user.controller.destroy', function(done) {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy')
        ).to.have.been.calledOnce;
      done();
    });
  });
});
