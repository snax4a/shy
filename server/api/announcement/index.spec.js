/* globals sinon, describe, it */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const announcementCtrlStub = {
  index: 'announcementCtrl.index',
  upsert: 'announcementCtrl.upsert',
  destroy: 'announcementCtrl.destroy'
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
  delete: sinon.spy()
};

// require the index with our stubbed out modules
const announcementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './announcement.controller': announcementCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Announcement API Router:', () => {
  it('should return an express router instance', done => {
    announcementIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/announcement', () => {
    it('should route to announcement.controller.index', done => {
      routerStub.get.withArgs('/', 'announcementCtrl.index')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('PUT /api/announcement/:id', () => {
    it('should be authenticated and route to announcement.controller.upsert', done => {
      routerStub.put.withArgs('/:id', 'authService.hasRole.admin', 'announcementCtrl.upsert')
        .should.have.been.calledOnce;
      done();
    });
  });

  describe('DELETE /api/announcement/:id', () => {
    it('should verify admin role and route to announcement.controller.destroy', done => {
      routerStub.delete.withArgs('/:id', 'authService.hasRole.admin', 'announcementCtrl.destroy')
        .should.have.been.calledOnce;
      done();
    });
  });
});
