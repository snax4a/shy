'use strict';
import email from '../../components/email';

// Implement: possibly share the client-side Item class
// so we don't need to repeat ourselves with getTotal and getTotalCost.

// Calculate the cartItem total
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
    placedOn: new Date().toLocaleString('en-US'),
    ccNumber: `**** **** **** ${req.body.paymentInfo.ccNumber.slice(-4)}`,
    forSomeoneElse: req.body.forSomeoneElse,
    methodToSend: req.body.methodToSend,
    instructions: req.body.instructions,
    purchaser: req.body.purchaser,
    recipient: req.body.recipient
  };

  // Implement: $http.get - get list of products and prices
  // Implement: Update price of each cartItem using ProductList to prevent tampering

  // Set the grandTotal based on revised pricing
  let cartItems = req.body.cartItems;
  confirmation.grandTotal = getTotalCost(cartItems);

  // Implement: Send confirmation details to payment gateway and get result
  // Implement: Change next 3 lines to be set by payment gateway
  confirmation.orderNumber = 'BL0PDFDF348D';
  confirmation.resultCode = 0;
  confirmation.resultDescription = 'Success';

  // Implement: If payment gateway returned success then email confirmation
  res.status(200).json(confirmation);

  // Log order details to console in case email fails (do same for errors)
  console.log(`Order ${confirmation.orderNumber} received`, confirmation);

  // Send email confirmation to the purchaser and BCC SHY admin
  email({
    to: req.body.purchaser.email,
    subject: 'Schoolhouse Yoga Order Confirmation',
    // Implement final HTML format on next line
    html: 'To be completed.',
    success: 'Thank you for your order.',
    failure: 'Error occurred with your order. Please try again later.'
  });
}
