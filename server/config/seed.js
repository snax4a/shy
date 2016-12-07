/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
let Order = sqldb.Order;
let Subscriber = sqldb.Subscriber;

// Upsert the order
Order.sync()
  .then(() => {
    Order.upsert({
      orderNumber: 'TEST-0001',
      grandTotal: 15.00,
      instructions: 'Split between John and Jane',
      isGift: true,
      treatment: 'Mail',
      purchaserFirstName: 'John',
      purchaserLastName: 'Doe',
      purchaserZipCode: '15217',
      purchaserEmail: 'jdoe@gmail.com',
      purchaserPhone: '412-555-1212',
      recipientFirstName: 'Jane',
      recipientLastName: 'Doe',
      recipientAddress: '123 Main Street',
      recipientCity: 'Pittsburgh',
      recipientState: 'PA',
      recipientZipCode: '15217',
      recipientEmail: 'j2doe@gmail.com',
      recipientPhone: '412-555-1212',
      itemsOrdered: [{id: 1, name: 'One class pass', price: 15, quantity: 1}]
    })
    .then(() => {
      console.log('SEQUELIZE: Test order upserted');
    });
  });

// Upsert  test subscriber and re-insert
Subscriber.sync()
  .then(() => {
    Subscriber.upsert({
      email: 'jdoe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '412-555-1212',
      optout: false
    })
    .then(() => {
      console.log('SEQUELIZE: Test subscriber upserted');
    });
  });
