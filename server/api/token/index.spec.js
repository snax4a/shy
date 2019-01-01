/* global sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  get: sinon.spy()
};

const tokenCtrlStub = {
  index: 'tokenCtrl.index'
};

const asyncWrapperStub = method => `asyncWrapper.${method}`;

// require the index with our stubbed out modules
const tokenIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../middleware/async-wrapper': asyncWrapperStub,
  './token.controller': tokenCtrlStub
});

describe('Token API Router:', function() {
  it('should return an express router instance', done => {
    tokenIndex.should.equal(routerStub);
    done();
  });

  describe('GET /api/token', function() {
    it('should route to token.controller.index', done => {
      routerStub.get.withArgs('/', 'asyncWrapper.tokenCtrl.index').should.have.been.calledOnce;
      done();
    });
  });
});
