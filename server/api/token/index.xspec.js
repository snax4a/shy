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

describe('Token API Router:', () => {
  it('should return an express router instance', () => {
    expect(tokenIndex).to.equal(routerStub);
  });

  describe('GET /api/token', () => {
    it('should route to token.controller.index', () => {
      expect(routerStub.get
        .withArgs('/', 'tokenCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
