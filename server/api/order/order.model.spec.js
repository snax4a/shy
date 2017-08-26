/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Order } from '../../sqldb';

let order;
let buildOrder = () => {
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

describe('Order Model', () => {
  before(() => // Sync and clear users before testing
    Order.sync().then(() =>  Order.destroy({ where: { instructions: 'This is a test' } })));

  beforeEach(() => {
    buildOrder();
  });

  afterEach(() => Order.destroy({ where: { instructions: 'This is a test' } }));

  describe('#orderNumber', () => {
    it('should fail when saving without an orderNumber', () => {
      order.orderNumber = null;
      return order.save().should.eventually.be.rejected;
    });
  });

  describe('#purchaserEmail', () => {
    it('should fail when saving without a purchaserEmail', () => {
      order.purchaserEmail = '';
      return order.save().should.eventually.be.rejected;
    });
  });

  describe('#recipientEmail', () => {
    it('should fail when saving without a recipientEmail', () => {
      order.recipientEmail = '';
      return order.save().should.eventually.be.rejected;
    });
  });

  describe('#itemsOrdered', () => {
    it('should fail when saving without a value for itemsOrdered', () => {
      order.itemsOrdered = null;
      return order.save().should.eventually.be.rejected;
    });
  });
});
