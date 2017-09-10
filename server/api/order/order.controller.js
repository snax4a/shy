/*
 POST    /api/order ->  placeOrder
*/
'use strict';
import braintree from 'braintree';
import nodemailer from 'nodemailer';
import Sequelize from 'sequelize';
import config from '../../config/environment';
import { User, Order } from '../../sqldb';
const products = require('../../../client/assets/data/products.json');

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

// Generate the order object from the HTTP request
const buildOrder = req => {
  let cartItems = req.body.cartItems;
  return {
    paymentMethodNonce: req.body.nonceFromClient,
    amount: getGrandTotal(cartItems),
    descriptor: {
      name: 'SH Yoga*Class Workshop',
      phone: '412-401-4444',
    },
    customFields: {
      gift: req.body.gift,
      sendvia: req.body.sendVia,
      instructions: req.body.instructions,
      items: JSON.stringify(cartItems),
      recipientphone: req.body.recipient.phone,
      recipientemail: req.body.recipient.email
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
};

// Generate the order confirmation email message object
const buildConfirmationEmail = confirmation => {
  let cartItemsHtml = '';
  confirmation.customFields.items.forEach(cartItem => {
    cartItemsHtml += `<tr><td class="left">${cartItem.name}</td><td class="center">${cartItem.quantity}</td>
      <td class="right">$${cartItem.price}</td><td class="right">$${getLineItemTotal(cartItem)}</td></tr>`;
  });
  return {
    to: confirmation.customer.email,
    bcc: config.mail.admins,
    subject: 'Schoolhouse Yoga Order Confirmation',
    html: `
      <style>
        body, td, th, p {
          font-family: HelveticaNeue-Light,'Helvetica Neue Light','Helvetica Neue',Helvetica,sans-serif;
          font-size: 11px;
        }
        tr {
          vertical-align: top;
        }
        .container {
          margin-left:auto;
          margin-right:auto;
          width:450px;
        }
        .seal-container {
          width:120px;
          padding-top:10px;
          padding-right:10px;
        }
        .seal {
          width:100px;
          height:100px;
        }
        .company-name {
          font-size: 18px;
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
      <table class="container">
        <tr>
          <td>
            <table style="width:100%">
              <tr>
                <td class="seal-container">
                  <a href="https://www.schoolhouseyoga.com"><img src="https://www.schoolhouseyoga.com/apple-touch-icon.png" alt="Schoolhouse Yoga Seal" class="seal"></a>
                </td>
                <td style="vertical-align:middle;padding-top:20px;">
                  <p>
                    <span class="company-name">Schoolhouse Yoga</span><br/>
                    Order ${confirmation.id}<br />
                    Paid via credit card (${confirmation.creditCard.last4}) on ${confirmation.createdAt}
                  </p>
                  <table style="width:100%;margin-top:20px;">
                    <tr>
                      <td>
                        <b>Purchaser</b><br/>
                        ${confirmation.customer.firstName} ${confirmation.customer.lastName}<br />
                        ${confirmation.customer.phone}<br/>
                        ${confirmation.customer.email}
                      </td>
                      <td style="display: ${confirmation.customFields.gift ? 'inline' : 'none'}">
                        <b>Recipient</b><br/>
                        ${confirmation.shipping.firstName} ${confirmation.shipping.lastName}<br/>
                        ${confirmation.shipping.streetAddress}<br/>
                        ${confirmation.shipping.locality}, ${confirmation.shipping.region} ${confirmation.shipping.postalCode}<br/>
                        ${confirmation.customFields.recipientphone}<br />
                        ${confirmation.customFields.recipientemail}
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
                <td style="text-align:right;font-weight:bold;padding-top:10px;">$${confirmation.amount}</td>
              </tr>
            </table>
            <p>
              <b>Order Comments:</b><br />
              ${confirmation.customFields.gift ? `Send gift via ${confirmation.customFields.sendvia}` : ''}<br/>
              ${(confirmation.customFields.instructions !== undefined ? `Instructions: ${confirmation.customFields.instructions}` : '')}
            </p>
            <p style="margin-top:20px;">
              Thanks for your order. Visit us again at <a href="https://www.schoolhouseyoga.com">https://www.schoolhouseyoga.com</a>.
            </p>
          </td>
        </tr>
      </table>`
  };
};

// Return a promise to the Braintree result object containing transaction details (if successful)
const braintreeGatewayTransactionSale = (req, res) => {
  // Grab Braintree gateway settings from config
  let gateway = braintree.connect(config.gateway);

  // Submit orderInfo to Braintree
  return gateway.transaction.sale(buildOrder(req))
    .then(braintreeTransaction => { // Did not get an error
      // Reformat some of the response
      braintreeTransaction.transaction.id = braintreeTransaction.transaction.id.toUpperCase();
      braintreeTransaction.transaction.customFields.gift = braintreeTransaction.transaction.customFields.gift === 'true';
      braintreeTransaction.transaction.createdAt = new Date(braintreeTransaction.transaction.createdAt).toLocaleString();
      braintreeTransaction.transaction.customFields.items = JSON.parse(braintreeTransaction.transaction.customFields.items);

      if(braintreeTransaction.success) {
        console.log(`Braintree order ${braintreeTransaction.transaction.id} created`);
        //res.status(200).json(result); // send response to client so it doesn't wait
        return braintreeTransaction;
      }
      // Communicated with Braintree but declined the transaction
      console.log('Braintree did not process the sale.');
      res.status(200).json(braintreeTransaction); // tell client what was wrong with the payment info
      return null;
    });
};

// Return promise to upserted Order and User
const saveToDB = braintreeTransaction => {
  if(!braintreeTransaction) return null; // Not an error in chain but don't save to database

  let confirmation = braintreeTransaction.transaction;
  return Sequelize.Promise.all([
    Order.upsert({
      orderNumber: confirmation.id,
      amount: confirmation.amount,
      instructions: confirmation.customFields.instructions,
      gift: confirmation.customFields.gift,
      sendVia: confirmation.customFields.sendvia,
      purchaserFirstName: confirmation.customer.firstName,
      purchaserLastName: confirmation.customer.lastName,
      purchaserEmail: confirmation.customer.email,
      purchaserPhone: confirmation.customer.phone,
      last4: confirmation.creditCard.last4,
      recipientFirstName: confirmation.shipping.firstName,
      recipientLastName: confirmation.shipping.lastName,
      recipientAddress: confirmation.shipping.streetAddress,
      recipientCity: confirmation.shipping.locality,
      recipientState: confirmation.shipping.region,
      recipientZipCode: confirmation.shipping.postalCode,
      recipientEmail: confirmation.customFields.recipientemail,
      recipientPhone: confirmation.customFields.recipientphone,
      itemsOrdered: confirmation.customFields.items
    }),
    User.upsert({
      email: confirmation.customFields.recipientemail,
      firstName: confirmation.shipping.firstName,
      lastName: confirmation.shipping.lastName,
      phone: confirmation.customFields.recipientphone,
      optOut: false
    })
  ])
    .then(() => braintreeTransaction);
};

// Return a promise to the Braintree Transaction - sends order confirmation via email
const emailConfirmation = braintreeTransaction => {
  if(!braintreeTransaction) return null; // Not an error in chain but don't send email  
  let confirmation = braintreeTransaction.transaction;
  let transporter = nodemailer.createTransport(config.mail.transport, { from: config.mail.transport.auth.user }); // to send the emails
  let message = buildConfirmationEmail(confirmation);

  // Send email and notify user
  return transporter.sendMail(message)
    .then(info => {
      console.log(`Emailed order confirmation to ${info.envelope.to} ${info.messageId}`);
      return braintreeTransaction;
    });
};

// Attempt to create order, send confirmation email then save to database
export function create(req, res) {
  return braintreeGatewayTransactionSale(req, res)
    .then(saveToDB)
    .then(emailConfirmation)
    .then(braintreeTransaction => {
      res.status(200).json(braintreeTransaction);
    })
    .catch(error => {
      console.log('Problem processing the order: ', error.message);
      if(!res.headersSent) return res.status(500).json(error);
    });
}
