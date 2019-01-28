/* global jest, describe, test, expect */
import express from 'express';
const routerStub = {
  post: jest.fn()
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

describe('Order API Router:', () => {
  test('should return an express router instance', done => {
    expect(orderIndex.default).toBe(routerStub);
    done();
  });

  describe('POST /api/order', () => {
    test('should route to order.controller.create', done => {
      expect(routerStub.post.withArgs('/', 'asyncWrapper.orderCtrl.create')).have.been.calledOnce;
      done();
    });
  });
});
