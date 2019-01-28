/* global jest, describe, test, expect */
import express from 'express';
const routerStub = {
  get: jest.fn()
};

const tokenCtrlStub = {
  index: 'tokenCtrl.index'
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

jest.mock('./token.controller', () => tokenCtrlStub);

// require the index with our stubbed out modules
const tokenIndex = require('./index.js');

describe('Token API Router:', () => {
  test('should return an express router instance', done => {
    expect(tokenIndex.default).toBe(routerStub);
    done();
  });

  describe('GET /api/token', () => {
    test('should route to token.controller.index', done => {
      expect(routerStub.get.withArgs('/', 'asyncWrapper.tokenCtrl.index')).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
