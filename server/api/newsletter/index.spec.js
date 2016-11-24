'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var newsletterCtrlStub = {
  subscribe: 'newsletterCtrl.subscribe'
};

var routerStub = {
  post: sinon.spy()
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

  describe('POST /api/newsletter/subscribe', function() {
    it('should route to newsletter.controller.subscribe', function() {
      expect(routerStub.post
        .withArgs('/subscribe', 'newsletterCtrl.subscribe')
        ).to.have.been.calledOnce;
    });
  });
});
