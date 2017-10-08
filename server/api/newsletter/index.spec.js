/* global sinon, describe, it, expect */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const newsletterCtrlStub = {
  subscribe: 'newsletterCtrl.subscribe',
  unsubscribe: 'newsletterCtrl.unsubscribe'
};

const routerStub = {
  post: sinon.spy(),
  get: sinon.spy()
};

// require the index with our stubbed out modules
const newsletterIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './newsletter.controller': newsletterCtrlStub
});

describe('Newsletter API Router:', () => {
  it('should return an express router instance', done => {
    newsletterIndex.should.equal(routerStub);
    done();
  });

  describe('POST /api/newsletter', () => {
    it('should route to newsletter.controller.subscribe', done => {
      routerStub.post.withArgs('/', 'newsletterCtrl.subscribe').should.have.been.calledOnce;
      done();
    });
  });

  describe('GET /api/newsletter/unsubscribe/:email', () => {
    it('should route to newsletter.controller.unsubscribe', done => {
      routerStub.get.withArgs('/unsubscribe/:email', 'newsletterCtrl.unsubscribe').should.have.been.calledOnce;
      done();
    });
  });
});
