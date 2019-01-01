/* globals sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  get: sinon.spy(),
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

const asyncWrapperStub = method => `asyncWrapper.${method}`;

const announcementCtrlStub = {
  index: 'announcementCtrl.index',
  upsert: 'announcementCtrl.upsert',
  destroy: 'announcementCtrl.destroy'
};

const announcementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../auth/auth.service': authServiceStub,
  '../../middleware/async-wrapper': asyncWrapperStub,
  './announcement.controller': announcementCtrlStub
});

describe('Announcement API Router:', function() {
  it('should return an express router instance', function(done) {
    announcementIndex.default.should.equal(routerStub);
    done();
  });

  describe('GET /api/announcement', function() {
    it('should route to announcement.controller.index', function(done) {
      routerStub.get.withArgs('/', 'asyncWrapper.announcementCtrl.index')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/announcement/:id', function() {
    it('should be authenticated and route to announcement.controller.upsert', function(done) {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.announcementCtrl.upsert')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/announcement/:id', function() {
    it('should verify admin role and route to announcement.controller.destroy', function(done) {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'asyncWrapper.announcementCtrl.destroy')
        .should.have.been.calledOnce;
      done();
    });
  });
});
