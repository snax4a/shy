'use strict';
import email from '../../components/email';

// Attempt to place the order
export function placeOrder(req, res) {
  //console.log(req.body);
  // extract from req.body later - THIS IS TEST DATA ONLY - pass paymentInfo
  let confirmation = {
    orderNumber: 'BL0PDFDF348D', // Later, pass in transaction ID
    placedOn: new Date().toLocaleString('en-US'),
    ccNumber: `**** **** **** ${req.body.paymentInfo.ccNumber.slice(-4)}`,
    forSomeoneElse: req.body.forSomeoneElse,
    methodToSend: req.body.methodToSend,
    purchaser: req.body.purchaser,
    recipient: req.body.recipient,
    cartItems: req.body.cartItems
  };
  console.log(confirmation);
  email({
    to: req.body.purchaser.email,
    subject: 'Schoolhouse Yoga Order Confirmation',
    html: 'To be completed.',
    success: 'Thank you for your order.',
    failure: 'Error occurred with your order. Please try again later.'
  }, res);
}
