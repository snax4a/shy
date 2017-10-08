/* global sinon, describe, it, expect */
'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const orderCtrlStub = {
  create: 'orderCtrl.create'
};

const routerStub = {
  post: sinon.spy()
};

// require the index with our stubbed out modules
const orderIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './order.controller': orderCtrlStub
});

describe('Order API Router:', () => {
  it('should return an express router instance', done => {
    orderIndex.should.equal(routerStub);
    done();
  });

  describe('POST /api/order', () => {
    it('should route to order.controller.create', done => {
      routerStub.post.withArgs('/', 'orderCtrl.create').should.have.been.calledOnce;
      done();
    });
  });
});
