'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var messageCtrlStub = {
  index: 'messageCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var messageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './message.controller': messageCtrlStub
});

describe('Message API Router:', function() {
  it('should return an express router instance', function() {
    expect(messageIndex).to.equal(routerStub);
  });

  describe('GET /api/message', function() {
    it('should route to message.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'messageCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
