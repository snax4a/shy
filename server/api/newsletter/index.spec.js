'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var newsletterCtrlStub = {
  index: 'newsletterCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var newsletterIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './newsletter.controller': newsletterCtrlStub
});

describe('Newsletter API Router:', function() {
  it('should return an express router instance', function() {
    expect(newsletterIndex).to.equal(routerStub);
  });

  describe('GET /api/newsletter', function() {
    it('should route to newsletter.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'newsletterCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
