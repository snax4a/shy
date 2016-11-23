'use strict';
import email from '../../components/email';

function getTotal(cartItem) {
  return parseFloat(cartItem.quantity * cartItem.price.toFixed(2));
}

// Calculate the total cost of all items
function getTotalCost(cartItems) {
  let total = 0;
  for(let cartItem of cartItems) {
    total += getTotal(cartItem);
  }
  return parseFloat(total).toFixed(2);
}

// Attempt to place the order
export function placeOrder(req, res) {
  let confirmation = {
    resultCode: 0,
    resultDescription: 'Success',
    orderNumber: 'BL0PDFDF348D', // Later, pass in transaction ID
    placedOn: new Date().toLocaleString('en-US'),
    ccNumber: `**** **** **** ${req.body.paymentInfo.ccNumber.slice(-4)}`,
    forSomeoneElse: req.body.forSomeoneElse,
    methodToSend: req.body.methodToSend,
    instructions: req.body.instructions,
    purchaser: req.body.purchaser,
    recipient: req.body.recipient,
    cartItems: req.body.cartItems,

  };
  // Implement: Revise the price of each cartItem based on product ID to prevent tampering
  // Implement: $http.get - get list of products and prices

  // Set the grandTotal based on revised pricing
  confirmation.grandTotal = getTotalCost(req.body.cartItems);

  // Implement: need a server-side
  // Implement call to payment gateway then set confirmation.orderNumber
  console.log('Send info to payment gateway and deal with result');

  // If payment gateway returned success then email confirmation
  res.status(200).json(confirmation);
  console.log(`Order ${confirmation.orderNumber} received`, confirmation);
  email({
    to: req.body.purchaser.email,
    subject: 'Schoolhouse Yoga Order Confirmation',
    html: 'To be completed.',
    success: 'Thank you for your order.',
    failure: 'Error occurred with your order. Please try again later.'
  });
}
