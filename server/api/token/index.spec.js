/* global sinon, describe, it */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const tokenCtrlStub = {
  index: 'tokenCtrl.index'
};

const routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
const tokenIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './token.controller': tokenCtrlStub
});

describe('Token API Router:', () => {
  it('should return an express router instance', done => {
    tokenIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/token', () => {
    it('should route to token.controller.index', done => {
      routerStub.get.withArgs('/', 'tokenCtrl.index').should.have.been.calledOnce;
      done();
    });
  });
});
