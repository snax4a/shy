'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var tokenCtrlStub = {
  index: 'tokenCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var tokenIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './token.controller': tokenCtrlStub
});

describe('Token API Router:', function() {
  it('should return an express router instance', function() {
    expect(tokenIndex).to.equal(routerStub);
  });

  describe('GET /api/token', function() {
    it('should route to token.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'tokenCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
