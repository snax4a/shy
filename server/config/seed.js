/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
let Order = sqldb.Order;
let Subscriber = sqldb.Subscriber;

// Delete the test order and re-insert
Order.sync()
  .then(() => Order.destroy({ where: { orderNumber: 'TEST-0001'} }))
  .then(() => {
    Order.bulkCreate([{
      orderNumber: 'TEST-0001',
      grandTotal: 15.00,
      instructions: 'Split between John and Jane',
      forSomeoneElse: true,
      methodToSend: 'Apply credit to recipient\'s account (default)',
      purchaserFirstName: 'John',
      purchaserLastName: 'Doe',
      purchaserAddress: '123 Main Street',
      purchaserCity: 'Pittsburgh',
      purchaserState: 'PA',
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
    }])
    .then(() => {
      console.log('SEQUELIZE: Test order inserted');
    });
  });

// Delete the test subscriber and re-insert
Subscriber.sync()
  .then(() => Subscriber.destroy({ where: { email: 'jdoe@gmail.com' } }))
  .then(() => {
    Subscriber.bulkCreate([{
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'Pittsburgh',
      state: 'PA',
      zipCode: '15217',
      email: 'jdoe@gmail.com',
      phone: '412-555-1212',
      optout: false
    }])
    .then(() => {
      console.log('SEQUELIZE: Test subscriber inserted');
    });
  });
