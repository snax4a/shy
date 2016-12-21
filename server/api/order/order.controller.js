/*
 POST    /api/order ->  placeOrder
*/
'use strict';
import email from '../../components/email';
import products from '../../../client/assets/data/products.json';
import Sequelize from 'sequelize';
import { Subscriber, Order } from '../../sqldb';
import braintree from 'braintree';
const config = require('../../config/environment');

// Calculate the cartItem total
const getLineItemTotal = cartItem => parseFloat(cartItem.quantity * cartItem.price.toFixed(0));

// Calculate the total cost of all items
const getGrandTotal = cartItems => {
  let total = 0;
  for(let cartItem of cartItems) {
    // Get the corrected price from the master product list and override in case of tampering
    cartItems.price = products.find(product => product.id === parseInt(cartItem.id, 10)).price;
    total += getLineItemTotal(cartItem);
  }
  return parseFloat(total).toFixed(0);
};

// Return a promise to the Braintree result object containing transaction details (if successful)
const braintreeGatewayTransactionSale = (req, res) => new Promise((resolve, reject) => {
  // Load cartItems array from body of request
  let cartItems = req.body.cartItems;

  // Grab Braintree gateway settings from config
  const gateway = braintree.connect(config.gateway);
  const orderInfo = {
    paymentMethodNonce: req.body.nonceFromClient,
    amount: getGrandTotal(cartItems),
    descriptor: {
      name: 'SHY*Wkshp/Class',
      phone: '+1-412-401-4444',
      url: 'schoolhouseyoga.com'
    },
    customFields: {
      isGift: req.body.isGift,
      treatment: req.body.treatment,
      instructions: req.body.instructions,
      cartItems: JSON.stringify(cartItems),
      recipientPhone: req.body.recipient.phone,
      recipientEmail: req.body.recipient.email
    },
    customer: {
      firstName: req.body.purchaser.firstName,
      lastName: req.body.purchaser.lastName,
      email: req.body.purchaser.email,
      phone: req.body.purchaser.phone
    },
    billing: {
      firstName: req.body.purchaser.firstName,
      lastName: req.body.purchaser.lastName
    },
    shipping: {
      firstName: req.body.recipient.firstName,
      lastName: req.body.recipient.lastName,
      streetAddress: req.body.recipient.address || null,
      locality: req.body.recipient.city || null,
      region: req.body.recipient.state ? req.body.recipient.state.toUpperCase() : 'PA',
      postalCode: req.body.recipient.zipCode || null,
      countryName: 'US'
    },
    taxExempt: true,
    options: {
      submitForSettlement: true
    }
  };
  console.log('orderInfo', orderInfo);
  gateway.transaction.sale(orderInfo, (gatewayErr, response) => {
    // For debugging only
    console.log('Braintree response', response);
    if(gatewayErr) {
      console.log('Error with Braintree gateway.transaction.sale', gatewayErr);
      res.status(500).json(response);
      return reject(gatewayErr);
    } else {
      res.status(200).json(response.transaction);
      return resolve(response.transaction);
    }
  });
});

// Return a promise to the Braintree Transaction - sends order confirmation via email
const emailConfirmation = braintreeTransaction => new Promise(resolve => {
  // Even if the email fails to send, we're continuing down the chain - just not that critical
  try {
    // Build block of HTML for cartItems
    let cartItems = JSON.parse(braintreeTransaction.customFields.cartItems);
    let cartItemsHtml = '';
    cartItems.forEach(cartItem => {
      cartItemsHtml += `<tr><td class="left">${cartItem.name}</td><td class="center">${cartItem.quantity}</td>
        <td class="right">$${cartItem.price}</td><td class="right">$${getLineItemTotal(cartItem)}</td></tr>`;
    });

    // Send the email
    email({
      to: braintreeTransaction.customer.email,
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
                      Order ${braintreeTransaction.id}<br />
                      Paid via credit card (${braintreeTransaction.creditCard.last4}) on ${braintreeTransaction.createdAt}
                    </p>
                    <table style="width:100%;margin-top:20px;">
                      <tr style="vertical-align:top;">
                        <td>
                          <b>Purchaser</b><br/>
                          ${braintreeTransaction.customer.firstName} ${braintreeTransaction.customer.lastName}<br />
                          ${braintreeTransaction.customer.phone}<br/>
                          ${braintreeTransaction.customer.email}
                        </td>
                        <td style="display: ${braintreeTransaction.customFields.isGift ? 'inline' : 'none'}">
                          <b>Recipient</b><br/>
                          ${braintreeTransaction.shipping.firstName} ${braintreeTransaction.shipping.lastName}<br/>
                          ${braintreeTransaction.shipping.streetAddress}<br/>
                          ${braintreeTransaction.shipping.locality}, ${braintreeTransaction.shipping.region} ${braintreeTransaction.shipping.postalCode}<br/>
                          ${braintreeTransaction.customFields.recipientPhone}<br />
                          ${braintreeTransaction.customFields.recipientEmail}
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
                  <td style="text-align:right;font-weight:bold;padding-top:10px;">$${braintreeTransaction.amount}</td>
                </tr>
              </table>
              <p>
                <b>Order Comments:</b><br />
                ${braintreeTransaction.customFields.isGift ? `Send gift via ${braintreeTransaction.customFields.treatment}` : ''}<br/>
                ${(braintreeTransaction.customFields.instructions !== undefined ? `Instructions: ${braintreeTransaction.customFields.instructions}` : '')}
              </p>
              <p style="margin-top:20px;">
                Thanks for your order. Visit us again at <a href="https://www.schoolhouseyoga.com">https://www.schoolhouseyoga.com</a>.
              </p>
            </td>
          </tr>
        </table>`,
      success: 'Thank you for your order.',
      failure: 'Error occurred with your order. Please try again later.'
// IMPLEMENT: take away the success and failure properties above now that we're passing the full Braintree response
    });
  } catch(errEmail) {
    console.log(errEmail);
  }
  resolve(braintreeTransaction);
});

// Return a promise to a database transaction
const saveToDB = braintreeTransaction => Sequelize.transaction(t => Order.upsert({
  orderNumber: braintreeTransaction.id,
  amount: braintreeTransaction.amount,
  instructions: braintreeTransaction.customFields.instructions,
  isGift: braintreeTransaction.customFields.isGift,
  treatment: braintreeTransaction.customFields.treatment,
  purchaserFirstName: braintreeTransaction.customer.firstName,
  purchaserLastName: braintreeTransaction.customer.lastName,
  purchaserEmail: braintreeTransaction.customer.email,
  purchaserPhone: braintreeTransaction.customer.phone,
  last4: braintreeTransaction.creditCard.last4,
  recipientFirstName: braintreeTransaction.shipping.firstName,
  recipientLastName: braintreeTransaction.shipping.lastName,
  recipientAddress: braintreeTransaction.shipping.streetAddress,
  recipientCity: braintreeTransaction.shipping.locality,
  recipientState: braintreeTransaction.shipping.region,
  recipientZipCode: braintreeTransaction.shipping.postalCode,
  recipientEmail: braintreeTransaction.customFields.recipientEmail,
  recipientPhone: braintreeTransaction.customFields.recipientPhone,
  itemsOrdered: braintreeTransaction.customFields.cartItems
}, { transaction: t })
  .then(() => Subscriber.upsert({
    email: braintreeTransaction.customFields.recipientEmail,
    firstName: braintreeTransaction.shipping.firstName,
    lastName: braintreeTransaction.shipping.lastName,
    phone: braintreeTransaction.customFields.recipientPhone,
    optout: false
  }, { transaction: t })));

// Attempt to create order, send confirmation email then save to database
export default function create(req, res) {
  braintreeGatewayTransactionSale(req, res)
    .then(emailConfirmation)
    .then(saveToDB)
    .catch(err => console.log('Problem somewhere in chain', err));
}

// Ignore - pre-cleaned code.
/*
  let confirmation = {
    placedOn: new Date().toLocaleString('en-US'),
    isGift: req.body.isGift,
    treatment: req.body.treatment,
    instructions: req.body.instructions,
    purchaser: req.body.purchaser,
    recipient: req.body.recipient
  };
  console.log('orderInformation', req.body);


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
    paymentMethodNonce: req.body.nonceFromClient,
    amount: confirmation.grandTotal,
    customer: {
      firstName: confirmation.purchaser.firstName,
      lastName: confirmation.purchaser.lastName,
      email: confirmation.purchaser.email,
      phone: confirmation.purchaser.phone
    },
    billing: {
      firstName: confirmation.purchaser.firstName,
      lastName: confirmation.purchaser.lastName
    },

    shipping: {
      firstName: confirmation.recipient.firstName,
      lastName: confirmation.recipient.lastName,
      streetAddress: confirmation.recipient.address || null,
      locality: confirmation.recipient.city || null,
      region: confirmation.recipient.state || 'PA',
      postalCode: confirmation.recipient.zipCode || null,
      countryName: 'US'
    },

    taxExempt: true,
    options: {
      submitForSettlement: true
    }
  }, (err, braintreeResponse) => {
    if(err) throw err;
    console.log('Success! BRAINTREE response:', braintreeResponse);
    confirmation.orderNumber = braintreeResponse.transaction.id;
    confirmation.resultDescription = braintreeResponse.transaction.processorResponseText;
    confirmation.resultCode = braintreeResponse.transaction.processorResponseCode;

    // Don't make the user wait for the database saves
    res.status(200).json(confirmation);

    // Just for debugging
    console.log(`Order ${confirmation.orderNumber} received`, confirmation);
  });


  // Not necessary to save to DB when the payment gateway does the same thing
  // Save order to the database
  Order.upsert({
    orderNumber: 'TEST-0001', // use Braintree's Transaction.id (eg "k39351gr")
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

}

*/
