'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var subscribeCtrlStub = {
  index: 'subscribeCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var subscribeIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './subscribe.controller': subscribeCtrlStub
});

describe('Subscribe API Router:', function() {
  it('should return an express router instance', function() {
    expect(subscribeIndex).to.equal(routerStub);
  });

  describe('GET /api/subscribe', function() {
    it('should route to subscribe.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'subscribeCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
