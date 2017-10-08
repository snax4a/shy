'use strict';
/* global sinon, describe, it, expect */
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
  it('should return an express router instance', done => {
    messageIndex.should.equal(routerStub);
    done();
  });

  describe('POST /api/message', function() {
    it('should route to message.controller.send', done => {
      routerStub.post.withArgs('/', 'messageCtrl.send').should.have.been.calledOnce;
      done();
    });
  });
});
