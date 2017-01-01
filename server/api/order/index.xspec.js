/* global sinon, describe, it, expect */
'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var orderCtrlStub = {
  create: 'orderCtrl.create'
};

var routerStub = {
  post: sinon.spy()
};

// require the index with our stubbed out modules
var orderIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './order.controller': orderCtrlStub
});

describe('Order API Router:', function() {
  it('should return an express router instance', function() {
    expect(orderIndex).to.equal(routerStub);
  });

  describe('POST /api/order', function() {
    it('should route to order.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'orderCtrl.create')
        ).to.have.been.calledOnce;
    });
  });
});
