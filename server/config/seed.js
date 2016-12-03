/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
let Order = sqldb.Order;

Order.sync()
  .then(() => Order.destroy({ where: { orderNumber: 'BL0PDFDF348D'} }))
  .then(() => {
    Order.bulkCreate([{
      orderNumber: 'BL0PDFDF348D',
      placedOn: '2017-01-13T18:30:00.000-05:00',
      grandTotal: 15,
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
    }]);
  });
