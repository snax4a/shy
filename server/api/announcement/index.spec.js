/* globals sinon, describe, it, test, expect */

const proxyquire = require('proxyquire').noPreserveCache();

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

const announcementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../auth/auth.service': authStub,
  '../../middleware/async-wrapper': {
    default: asyncWrapperStub
  },
  './announcement.controller': controllerStub
});

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
