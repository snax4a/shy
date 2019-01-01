/* globals sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
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

// require the index with our stubbed out modules
const scheduleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../auth/auth.service': authServiceStub,
  '../../middleware/async-wrapper': asyncWrapperStub,
  './schedule.controller': scheduleCtrlStub
});

describe('Schedule API Router:', function() {
  it('should return an express router instance', done => {
    scheduleIndex.default.should.equal(routerStub);
    done();
  });

  describe('GET /api/schedule', function() {
    it('should route to schedule.controller.index', done => {
      routerStub.get.withArgs('/', 'asyncWrapper.scheduleCtrl.index').should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/schedule/:id', function() {
    it('should be authenticated and route to schedule.controller.upsert', done => {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.scheduleCtrl.upsert').should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/schedule/:id', function() {
    it('should verify admin role and route to schedule.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.scheduleCtrl.destroy').should.have.been.calledOnce;
      done();
    });
  });
});
