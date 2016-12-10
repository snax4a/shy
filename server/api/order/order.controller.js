/*
 POST    /api/order ->  placeOrder
*/
'use strict';
import email from '../../components/email';
import products from '../../../client/assets/data/products.json';
import { Subscriber } from '../../sqldb';
import braintree from 'braintree';
const config = require('../../config/environment');

// Calculate the cartItem total
function getTotal(cartItem) {
  return parseFloat(cartItem.quantity * cartItem.price.toFixed(0));
}

// Calculate the total cost of all items
function getTotalCost(cartItems) {
  let total = 0;
  for(let cartItem of cartItems) {
    total += getTotal(cartItem);
  }
  return parseFloat(total).toFixed(0);
}

/*
// These functions would be fine except that we need to send the response after the payment gateway returns a result.
// Don't make the user wait for emails to be sent and to save the subscriber in the database (low priority).
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return entity => {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}
*/

// Attempt to create the order - payment gateway, save to database, generate email
export function create(req, res) {
  let confirmation = {
    placedOn: new Date().toLocaleString('en-US'),
    isGift: req.body.isGift,
    treatment: req.body.treatment,
    instructions: req.body.instructions,
    purchaser: req.body.purchaser,
    recipient: req.body.recipient
  };

  // Capitalize the state before storing
  confirmation.recipient.state = confirmation.recipient.state.toUpperCase();

  // Load cartItems array from body of request
  let cartItems = req.body.cartItems;

  // Overwrite prices in case of tampering on the client
  for(let cartItem of cartItems) {
    cartItem.price = products.find(product => product.id === parseInt(cartItem.id, 10)).price;
  }

  // Set the grandTotal based on revised pricing
  confirmation.grandTotal = getTotalCost(cartItems);

  // Grab Braintree gateway settings from config
  const gateway = braintree.connect(config.gateway);

  // Process sale
  gateway.transaction.sale({
    amount: '10.00',
    // Implement: Add other fields later
    paymentMethodNonce: req.body.payment_method_nonce,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if(err) throw err;
    console.log('BRAINTREE RESULT:', result);
    // Implement: move the stuff for successful orders (and failures) here
  });

  // Implement: Change next 3 lines to be set by payment gateway
  confirmation.orderNumber = 'BL0PDFDF348D';
  confirmation.resultCode = 0;
  confirmation.resultDescription = 'Success';

  // Don't make the user wait for the database saves
  res.status(200).json(confirmation);

  // Log order details to console in case email fails (do same for errors)
  console.log(`Order ${confirmation.orderNumber} received`, confirmation);

/*
  // Not necessary to save to DB when the payment gateway does the same thing
  // Save order to the database
  Order.upsert({
    orderNumber: 'TEST-0001',
    grandTotal: getTotalCost(cartItems),
    instructions: confirmation.instructions,
    isGift: confirmation.isGift,
    treatment: confirmation.treatment,
    purchaserFirstName: confirmation.purchaser.firstName,
    purchaserLastName: confirmation.purchaser.lastName,
    purchaserEmail: confirmation.purchaser.email,
    purchaserPhone: confirmation.purchaser.phone,
    recipientFirstName: confirmation.recipient.firstName,
    recipientLastName: confirmation.recipient.lastName,
    recipientAddress: confirmation.recipient.address,
    recipientCity: confirmation.recipient.city,
    recipientState: confirmation.recipient.state.toUpperCase(),
    recipientZipCode: confirmation.recipient.zipCode,
    recipientEmail: confirmation.recipient.email,
    recipientPhone: confirmation.recipient.phone,
    itemsOrdered: cartItems
  })
  // Implement: send the res.status(200).json(confirmation) from above here - test it
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
*/
  // Save subscriber to the database
  Subscriber.upsert({
    email: confirmation.recipient.email,
    firstName: confirmation.recipient.firstName,
    lastName: confirmation.recipient.lastName,
    phone: confirmation.recipient.phone,
    optout: false
  })
  .then(() => {
    console.log('Subscriber created from order.controller.js:create()');
  });

  // Send email confirmation to the purchaser and BCC SHY admin

  // Build block of HTML for cartItems
  let cartItemsHtml = '';
  cartItems.forEach(cartItem => {
    cartItemsHtml += `<tr><td class="left">${cartItem.name}</td><td class="center">${cartItem.quantity}</td>
      <td class="right">$${cartItem.price}</td><td class="right">$${getTotal(cartItem)}</td></tr>`;
  });
  // Now send it
  email({
    to: req.body.purchaser.email,
    subject: 'Schoolhouse Yoga Order Confirmation',
    // Implement final HTML format on next line
    html: `
      <style>
        td, th, p {
          font-family: HelveticaNeue-Light,'Helvetica Neue Light','Helvetica Neue',Helvetica,sans-serif;
          font-size: 11px;
        }
        .left {
          width: 240px;
          text-align: left!important;
        }
        .center {
          text-align: center!important;
          width: 40px;
        }
        .right {
          text-align: right!important;
          width: 60px;
        }
      </style>
      <table style="margin-left:auto;margin-right:auto;width:450px;">
        <tr>
          <td>
            <table style="width:100%">
              <tr style="vertical-align:top;">
                <td style="width:120px;padding-top:10px;padding-right:10px;">
                  <a href="https://www.schoolhouseyoga.com"><img src="https://www.schoolhouseyoga.com/images/seal.jpg" alt="Schoolhouse Yoga Seal" style="width:100px;height:100px;"></a>
                </td>
                <td style="vertical-align:middle;padding-top:20px;font-family:HelveticaNeue-Light,'Helvetica Neue Light','Helvetica Neue',Helvetica,sans-serif;">
                  <p>
                    <span style="font-size:18px">Schoolhouse Yoga</span><br/>
                    Order ${confirmation.orderNumber}<br />
                    Paid via credit card on ${confirmation.placedOn}
                  </p>
                  <table style="width:100%;margin-top:20px;">
                    <tr style="vertical-align:top;">
                      <td>
                        <b>Purchaser</b><br/>
                        ${confirmation.purchaser.firstName} ${confirmation.purchaser.lastName}<br />
                        ${confirmation.purchaser.phone}<br/>
                        ${confirmation.purchaser.email}
                      </td>
                      <td style="display: ${confirmation.isGift ? 'inline' : 'none'}">
                        <b>Recipient</b><br/>
                        ${confirmation.recipient.firstName} ${confirmation.recipient.lastName}<br/>
                        ${confirmation.recipient.address}<br/>
                        ${confirmation.recipient.city}, ${confirmation.recipient.state} ${confirmation.recipient.zipCode}<br/>
                        ${confirmation.recipient.phone}<br />
                        ${confirmation.recipient.email}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table style="margin-top:30px;">
              <tr>
                <th class="left">Item</th>
                <th class="center">Qty</th>
                <th class="right">Each</th>
                <th class="right">Cost</th>
              </tr>
              ${cartItemsHtml}
              <tr>
                <td colspan="3" style="text-align:right;font-weight:bold;padding-top:10px">Grand Total</td>
                <td style="text-align:right;font-weight:bold;padding-top:10px;">$${confirmation.grandTotal}</td>
              </tr>
            </table>
            <p>
              <b>Order Comments:</b><br />
              ${confirmation.isGift ? `Send gift via ${confirmation.treatment}` : ''}<br/>
              ${(confirmation.instructions !== undefined ? `Instructions: ${confirmation.instructions}` : '')}
            </p>
            <p style="margin-top:20px;">
              Thanks for your order. Visit us again at <a href="https://www.schoolhouseyoga.com">https://www.schoolhouseyoga.com</a>.
            </p>
          </td>
        </tr>
      </table>`,
    success: 'Thank you for your order.',
    failure: 'Error occurred with your order. Please try again later.'
  });
}
