'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var orderCtrlStub = {
  index: 'orderCtrl.index'
};

var routerStub = {
  get: sinon.spy()
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

  describe('GET /api/order', function() {
    it('should route to order.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'orderCtrl.index')
        ).to.have.been.calledOnce;
    });
  });
});
