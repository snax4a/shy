'use strict';
/* global sinon, describe, it, expect */
var proxyquire = require('proxyquire').noPreserveCache();

var messageCtrlStub = {
  send: 'messageCtrl.send'
};

var routerStub = {
  post: sinon.spy()
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

  describe('POST /api/message', function() {
    it('should route to message.controller.send', function() {
      expect(routerStub.post
        .withArgs('/', 'messageCtrl.send')
        ).to.have.been.calledOnce;
    });
  });
});
