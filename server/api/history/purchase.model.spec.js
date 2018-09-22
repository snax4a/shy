/* global describe, before, beforeEach, afterEach, it */
'use strict';
import { Purchase } from '../../sqldb';

let purchase;
let buildPurchase = () => {
  purchase = Purchase.build({
    UserId: 1,
    purchased: '2018-12-31T13:00:00.000-04:00',
    quantity: 1,
    method: 'Cash',
    notes: 'Testing.'
  });
  return purchase;
};

describe('Purchase Model', () => {
  before(() => Purchase.sync()
    .then(() => Purchase.destroy({ where: { notes: 'Testing.' } })));

  beforeEach(() => {
    buildPurchase();
  });

  afterEach(() => Purchase.destroy({ where: { notes: 'Testing.' } }));

  describe('#userId', () => {
    it('should fail when saving without a user ID', () => {
      purchase.userId = undefined;
      return purchase.save().should.eventually.be.rejected;
    });
  });

  describe('#quantity', () => {
    it('should fail when saving without a quantity', () => {
      purchase.quantity = undefined;
      return purchase.save().should.eventually.be.rejected;
    });
  });

  describe('#method', () => {
    it('should fail when saving without a purchase method', () => {
      purchase.method = undefined;
      return purchase.save().should.eventually.be.rejected;
    });
  });
});
