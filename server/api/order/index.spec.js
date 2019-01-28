/* global sinon, jest, describe, it, test, expect */
import express from 'express';
const routerStub = {
  post: sinon.spy()
};

const orderCtrlStub = {
  create: 'orderCtrl.create'
};

const asyncWrapperStub = method => `asyncWrapper.${method}`;

jest.mock(express, () => ({
  Router() {
    return routerStub;
  }
}));

jest.mock('../../middleware/async-wrapper', () => ({
  default: asyncWrapperStub
}));

jest.mock('./order.controller', () => orderCtrlStub);

// require the index with our stubbed out modules
const orderIndex = require('./index.js');

describe('Order API Router:', function() {
  it('should return an express router instance', done => {
    expect(orderIndex.default).toBe(routerStub);
    done();
  });

  describe('POST /api/order', function() {
    it('should route to order.controller.create', done => {
      expect(routerStub.post.withArgs('/', 'asyncWrapper.orderCtrl.create')).have.been.calledOnce;
      done();
    });
  });
});
