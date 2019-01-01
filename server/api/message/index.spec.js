/* global sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  post: sinon.spy()
};

const messageCtrlStub = {
  send: 'messageCtrl.send'
};

const asyncWrapperStub = method => `asyncWrapper.${method}`;

// require the index with our stubbed out modules
const messageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../middleware/async-wrapper': {
    default: asyncWrapperStub
  },
  './message.controller': messageCtrlStub
});

describe('Message API Router:', function() {
  it('should return an express router instance', done => {
    messageIndex.default.should.equal(routerStub);
    done();
  });

  describe('POST /api/message', function() {
    it('should route to message.controller.send', done => {
      routerStub.post.withArgs('/', 'asyncWrapper.messageCtrl.send').should.have.been.calledOnce;
      done();
    });
  });
});
