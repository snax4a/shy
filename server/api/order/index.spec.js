'use strict';

const proxyquire = require('proxyquire').noPreserveCache();

const orderCtrlStub = {
  placeOrder: 'orderCtrl.placeOrder'
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

describe('Order API Router:', function() {
  it('should return an express router instance', function() {
    expect(orderIndex).to.equal(routerStub);
  });

  describe('POST /api/order', function() {
    it('should route to order.controller.placeOrder', function() {
      expect(routerStub.post
        .withArgs('/', 'orderCtrl.placeOrder')
        ).to.have.been.calledOnce;
    });
  });
});
