/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { Order } from '../../sqldb';

let order;
let buildOrder = function() {
  order = Order.build({
    provider: 'local',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '412-555-1212',
    password: 'password',
    optOut: true
  });
  return order;
};

describe('Order Model', function() {
  before(function() {
    // Sync and clear users before testing
    return Order.sync().then(function() {
      return Order.destroy({ where: { email: 'test@example.com' } });
    });
  });

  beforeEach(function() {
    buildOrder();
  });

  afterEach(function() {
    return Order.destroy({ where: { email: 'test@example.com' } });
  });

  it('should begin with no orders seeded', function() {
    expect(Order.findAll()).to.eventually.have.length(4);
  });

  it('should fail when saving a duplicate order', function() {
    return expect(order.save()
      .then(function() {
        let orderDup = buildOrder();
        return orderDup.save();
      })).to.be.rejected;
  });

  describe('#email', function() {
    it('should fail when saving without an email', function(done) {
      order.email = '';
      expect(order.save()).to.be.rejected;
      done();
    });
  });
});
