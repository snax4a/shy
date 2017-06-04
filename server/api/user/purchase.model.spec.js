/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Purchase } from '../../sqldb';

let purchase;
let buildPurchase = function() {
  purchase = Purchase.build({
    userId: 1,
    purchased: '2017-05-21T13:00:00.000-04:00',
    quantity: 1,
    method: 'Cash',
    notes: 'Testing.'
  });
  return purchase;
};

describe('Purchase Model', function() {
  before(function() {
    // Sync and clear purchases before testing
    return Purchase.sync().then(function() {
      return Purchase.destroy({ where: { notes: 'Testing.' } });
    });
  });

  beforeEach(function() {
    buildPurchase();
  });

  afterEach(function() {
    return Purchase.destroy({ where: { notes: 'Testing.' } });
  });

  describe('#userId', function() {
    it('should fail when saving without a user ID', function(done) {
      purchase.userId = undefined;
      expect(purchase.save()).to.be.rejected;
      done();
    });
  });

  describe('#purchased', function() {
    it('should fail when saving without a purchase date', function(done) {
      purchase.purchased = undefined;
      expect(purchase.save()).to.be.rejected;
      done();
    });
  });

  describe('#quantity', function() {
    it('should fail when saving without a quantity', function(done) {
      purchase.quantity = undefined;
      expect(purchase.save()).to.be.rejected;
      done();
    });
  });

  describe('#method', function() {
    it('should fail when saving without a purchase method', function(done) {
      purchase.method = undefined;
      expect(purchase.save()).to.be.rejected;
      done();
    });
  });
});
