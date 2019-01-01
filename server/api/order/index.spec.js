/* global sinon, describe, it */

const proxyquire = require('proxyquire').noPreserveCache();

const routerStub = {
  post: sinon.spy()
};

const orderCtrlStub = {
  create: 'orderCtrl.create'
};

const asyncWrapperStub = method => `asyncWrapper.${method}`;

// require the index with our stubbed out modules
const orderIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  '../../middleware/async-wrapper': asyncWrapperStub,
  './order.controller': orderCtrlStub
});

describe('Order API Router:', function() {
  it('should return an express router instance', done => {
    orderIndex.default.should.equal(routerStub);
    done();
  });

  describe('POST /api/order', function() {
    it('should route to order.controller.create', done => {
      routerStub.post.withArgs('/', 'asyncWrapper.orderCtrl.create').should.have.been.calledOnce;
      done();
    });
  });
});
