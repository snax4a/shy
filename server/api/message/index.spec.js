'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const messageCtrlStub = {
  send: 'messageCtrl.send'
};

const routerStub = {
  post: sinon.spy()
};

// require the index with our stubbed out modules
const messageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './message.controller': messageCtrlStub
});

describe('Message API Router:', () => {
  it('should return an express router instance', () => {
    expect(messageIndex).to.equal(routerStub);
  });

  describe('POST /api/message', () => {
    it('should route to message.controller.send', () => {
      expect(routerStub.post
        .withArgs('/', 'messageCtrl.send')
        ).to.have.been.calledOnce;
    });
  });
});
