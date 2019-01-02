/* globals sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

const userCtrlStub = {
  index: 'userCtrl.index',
  destroy: 'userCtrl.destroy',
  me: 'userCtrl.me',
  update: 'userCtrl.update',
  create: 'userCtrl.create',
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

// require the index with our stubbed out modules
const userIndex = proxyquire('./index', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../auth/auth.service': authServiceStub,
  '../../middleware/async-wrapper': {
    default: asyncWrapperStub
  },
  './user.controller': userCtrlStub
});


describe('User API Router:', function() {
  it('should return an express router instance', done => {
    userIndex.default.should.equal(routerStub);
    done();
  });

  describe('GET /api/users', function() {
    it('should verify admin role and route to user.controller.index', done => {
      routerStub.get.withArgs('/', 'authService.hasRole.teacher', 'asyncWrapper.userCtrl.index').should.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/users/me', function() {
    it('should be authenticated and route to user.controller.me', done => {
      routerStub.get.withArgs('/me', 'authService.isAuthenticated', 'asyncWrapper.userCtrl.me').should.to.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users', function() {
    it('should route to user.controller.create', done => {
      routerStub.post.withArgs('/', 'asyncWrapper.userCtrl.create').should.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users/forgotpassword', function() {
    it('should route to user.controller.forgotPassword', done => {
      routerStub.post.withArgs('/forgotpassword', 'asyncWrapper.userCtrl.forgotPassword').should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/users/:id', function() {
    it('should be authenticated and route to user.controller.update', done => {
      routerStub.put.withArgs('/:id', 'authService.isAuthenticated', 'asyncWrapper.userCtrl.update').should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/users/:id/admin', function() {
    it('should be authenticated and route to user.controller.upsert', done => {
      routerStub.put.withArgs('/:id/admin', 'authService.hasRole.teacher', 'asyncWrapper.userCtrl.upsert').should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/users/:id', function() {
    it('should verify admin role and route to user.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.userCtrl.destroy').should.have.been.calledOnce;
      done();
    });
  });

  describe('POST /api/users/subscribe', function() {
    it('should route to user.controller.subscribe', done => {
      routerStub.post.withArgs('/subscribe', 'asyncWrapper.userCtrl.subscribe').should.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/users/unsubscribe/:email', function() {
    it('should route to user.controller.unsubscribe', done => {
      routerStub.get.withArgs('/unsubscribe/:email', 'asyncWrapper.userCtrl.unsubscribe').should.have.been.calledOnce;
      done();
    });
  });
});
