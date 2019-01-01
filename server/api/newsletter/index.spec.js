/* global sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  post: sinon.spy(),
  get: sinon.spy()
};

const newsletterCtrlStub = {
  subscribe: 'newsletterCtrl.subscribe',
  unsubscribe: 'newsletterCtrl.unsubscribe'
};

const asyncWrapperStub = method => `asyncWrapper.${method}`;

// require the index with our stubbed out modules
const newsletterIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../middleware/async-wrapper': asyncWrapperStub,
  './newsletter.controller': newsletterCtrlStub
});

describe('Newsletter API Router:', function() {
  it('should return an express router instance', done => {
    newsletterIndex.default.should.equal(routerStub);
    done();
  });

  describe('POST /api/newsletter', function() {
    it('should route to newsletter.controller.subscribe', done => {
      routerStub.post.withArgs('/', 'asyncWrapper.newsletterCtrl.subscribe').should.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/newsletter/unsubscribe/:email', function() {
    it('should route to newsletter.controller.unsubscribe', done => {
      routerStub.get.withArgs('/unsubscribe/:email', 'asyncWrapper.newsletterCtrl.unsubscribe').should.have.been.calledOnce;
      done();
    });
  });
});
