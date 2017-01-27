/* global sinon, describe, it, expect */
'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var newsletterCtrlStub = {
  subscribe: 'newsletterCtrl.subscribe',
  unsubscribe: 'newsletterCtrl.unsubscribe'
};

var routerStub = {
  post: sinon.spy(),
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
  it('should return an express router instance', function(done) {
    expect(newsletterIndex).to.equal(routerStub);
    done();
  });

  describe('POST /api/newsletter', function() {
    it('should route to newsletter.controller.subscribe', function(done) {
      expect(routerStub.post
        .withArgs('/', 'newsletterCtrl.subscribe')
        ).to.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/newsletter/unsubscribe/:email', function() {
    it('should route to newsletter.controller.unsubscribe', function(done) {
      expect(routerStub.get
        .withArgs('/unsubscribe/:email', 'newsletterCtrl.unsubscribe')
        ).to.have.been.calledOnce;
      done();
    });
  });
});
