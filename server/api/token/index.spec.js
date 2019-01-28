/* global sinon, jest, describe, test, it, expect */
import express from 'express';
const routerStub = {
  get: sinon.spy()
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

describe('Token API Router:', function() {
  it('should return an express router instance', done => {
    tokenIndex.default.should.equal(routerStub);
    done();
  });

  describe('GET /api/token', function() {
    it('should route to token.controller.index', done => {
      routerStub.get.withArgs('/', 'asyncWrapper.tokenCtrl.index').should.have.been.calledOnce;
      done();
    });
  });
});
