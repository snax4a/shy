/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Order } from '../../sqldb';

let order;
let buildOrder = function() {
  order = Order.build({
    orderNumber: '00000000',
    amount: 100,
    gift: true,
    instructions: 'This is a test',
    sendVia: 'email',
    purchaserFirstName: 'John',
    purchaserLastName: 'Doe',
    purchaserEmail: 'john.doe@gmail.com',
    purchaserPhone: '412-555-1212',
    last4: '0339',
    recipientFirstName: 'Jane',
    recipientLastName: 'Doe',
    recipientAddress: '123 Main Street',
    recipientCity: 'Pittsburgh',
    recipientState: 'PA',
    recipientZipCode: '15200',
    recipientEmail: 'jane.doe@gmail.com',
    recipientPhone: '412-555-1212',
    itemsOrdered: '[{"id":4,"name":"Twelve class pass","price":100,"quantity":1}]'
  });
  return order;
};

describe('Order Model', function() {
  before(function() {
    // Sync and clear users before testing
    return Order.sync().then(function() {
      return Order.destroy({ where: { instructions: 'This is a test' } });
    });
  });

  beforeEach(function() {
    buildOrder();
  });

  afterEach(function() {
    return Order.destroy({ where: { instructions: 'This is a test' } });
  });

  describe('#orderNumber', function() {
    it('should fail when saving without an orderNumber', function(done) {
      order.orderNumber = '';
      expect(order.save()).to.be.rejected;
      done();
    });
  });

  describe('#purchaserEmail', function() {
    it('should fail when saving without a purchaserEmail', function(done) {
      order.purchaserEmail = '';
      expect(order.save()).to.be.eventually.rejected;
      done();
    });
  });

  describe('#recipientEmail', function() {
    it('should fail when saving without a recipientEmail', function(done) {
      order.recipientEmail = '';
      expect(order.save()).to.be.rejected;
      done();
    });
  });

  describe('#itemsOrdered', function() {
    it('should fail when saving without a value for itemsOrdered', function(done) {
      //order.itemsOrdered = '';
      delete order.itemsOrdered;
      expect(order.save()).to.be.eventually.rejected;
      done();
    });
  });
});
