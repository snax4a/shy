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
  it('should return an express router instance', function(done) {
    expect(orderIndex).to.equal(routerStub);
    done();
  });

  describe('POST /api/order', function() {
    it('should route to order.controller.create', function(done) {
      expect(routerStub.post
        .withArgs('/', 'orderCtrl.create')
        ).to.have.been.calledOnce;
      done();
    });
  });
});
