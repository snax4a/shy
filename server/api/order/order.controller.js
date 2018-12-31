'use strict';

import braintree from 'braintree';
import config from '../../config/environment';
import db from '../../db';

const products = require('../../../client/assets/data/products.json');

class BraintreeError extends Error {
  constructor(message, path) {
    super(message);
    this.message = message;
    this.name = 'BraintreeError';
    this.errors = [{message, path}];
    Error.captureStackTrace(this, this.constructor);
  }
}

// Calculate the cartItem total
const getLineItemTotal = cartItem => parseFloat(cartItem.quantity * cartItem.price.toFixed(0));

// Calculate the total cost of all items
const getGrandTotal = cartItems => {
  let total = 0;
  for(let cartItem of cartItems) {
    // Get the corrected price from the master product list and override in case of tampering
    cartItem.price = products.find(product => product.id === parseInt(cartItem.id, 10)).price;
    total += getLineItemTotal(cartItem);
  }
  return parseFloat(total).toFixed(0);
};

// Abbreviate what was ordered so it'll fit in Braintree (qty x productId @ unitPrice)
const abbreviateCartItems = cartItems => {
  let abbreviation = '';
  for(let cartItem of cartItems) {
    abbreviation += `${cartItem.quantity} x ${cartItem.id} @ $${cartItem.price}, `;
  }
  return abbreviation.substring(0, abbreviation.length - 2); // remove last comma and space
};

// Generate order object Braintree can digest from HTTP request
const buildOrder = body => {
  let cartItems = body.cartItems;
  return {
    paymentMethodNonce: body.nonceFromClient,
    amount: getGrandTotal(cartItems),
    descriptor: {
      name: 'SH Yoga*Class Workshop',
      phone: '412-401-4444',
    },
    customFields: {
      gift: body.gift,
      sendvia: body.sendVia,
      instructions: body.instructions,
      items: abbreviateCartItems(cartItems),
      recipientphone: body.recipient.phone,
      recipientemail: body.recipient.email
    },
    customer: {
      firstName: body.purchaser.firstName,
      lastName: body.purchaser.lastName,
      email: body.purchaser.email,
      phone: body.purchaser.phone
    },
    billing: {
      firstName: body.purchaser.firstName,
      lastName: body.purchaser.lastName
    },
    shipping: {
      firstName: body.recipient.firstName,
      lastName: body.recipient.lastName,
      streetAddress: body.recipient.address || null,
      locality: body.recipient.city || null,
      region: body.recipient.state ? body.recipient.state.toUpperCase() : 'PA',
      postalCode: body.recipient.zipCode || null,
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
                    Paid via credit card (${confirmation.creditCard.last4}) on ${new Date(confirmation.createdAt).toLocaleString()}
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
              Thanks for your order. Visit us again at <a href="https://www.schoolhouseyoga.com">https://www.schoolhouseyoga.com</a>.<br/>
              Please note: class passes expire 6 months after date purchased.
            </p>
          </td>
        </tr>
      </table>`
  };
};

// Return a promise to the Braintree result object containing transaction details (if successful)
const braintreeGatewayTransactionSale = async orderInfo => {
  // Grab Braintree gateway settings from config
  let gateway = braintree.connect(config.gateway); // synchronous

  // Submit orderInfo to Braintree
  const braintreeResponse = await gateway.transaction.sale(orderInfo);
  if(!braintreeResponse.success) {
    let thisError = new BraintreeError(braintreeResponse.message, 'number');
    thisError.status = 503;
    throw thisError;
  }
  let { transaction } = braintreeResponse;

  // Reformat some of the response
  transaction.id = transaction.id.toUpperCase();
  transaction.customFields.gift = transaction.customFields.gift === 'true';

  return transaction;
};

// Return promise to upserted Order and User
const saveToDB = async confirmation => {
  const arrOrderParams = [
    confirmation.id, confirmation.amount, confirmation.customFields.instructions, confirmation.customFields.gift,
    confirmation.customFields.sendvia, confirmation.customer.firstName, confirmation.customer.lastName,
    confirmation.customer.email, confirmation.customer.phone, confirmation.creditCard.last4, confirmation.shipping.firstName,
    confirmation.shipping.lastName, confirmation.shipping.streetAddress, confirmation.shipping.locality, confirmation.shipping.region,
    confirmation.shipping.postalCode, confirmation.customFields.recipientemail, confirmation.customFields.recipientphone,
    JSON.stringify(confirmation.customFields.items)
  ];

  const orderInsertSQL = `INSERT INTO "Orders" (
    "orderNumber", amount, instructions, gift, "sendVia",
    "purchaserFirstName", "purchaserLastName", "purchaserEmail",
    "purchaserPhone", last4, "recipientFirstName", "recipientLastName",
    "recipientAddress", "recipientCity", "recipientState",
    "recipientZipCode", "recipientEmail", "recipientPhone",
    "itemsOrdered") VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19);`;

  const { recipientemail, recipientphone } = confirmation.customFields;
  const { firstName, lastName } = confirmation.shipping;
  const userUpsertSQL = `INSERT INTO "Users"
    (email, "firstName", "lastName", phone, "optOut")
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email) DO UPDATE
       SET "firstName" = $2, "lastName" = $3, phone = $4, "optOut" = $5;`;

  // Run the queries in parallel
  await Promise.all([
    db.query(orderInsertSQL, arrOrderParams),
    db.query(userUpsertSQL, [recipientemail, firstName, lastName, recipientphone, false])
  ]);
};

// Process Braintree order -> send response -> save to DB -> send email confirmation
export async function create(req, res) {
  // Convert req.body into Braintree's expected format
  const orderInfo = buildOrder(req.body);

  // Submit braintree transaction (takes about 1.5s)
  const transaction = await braintreeGatewayTransactionSale(orderInfo);
  // Overwrite abbreviated cartItems (for Braintree) with array for rest of the steps
  transaction.customFields.items = req.body.cartItems;

  // No error so far? Send succesful Braintree transaction to client (don't wait for db and email)
  res.status(200).send(transaction);

  // Suppress errors going to global error-handler in routes.js
  // when saving to database or sending email since order was successfully captured

  // First, save everything to the database (do not use Promise.all() with email sending)
  try {
    await saveToDB(transaction);
  } catch(err) {
    console.warn('\x1b[33m%s\x1b[0mWARNING: Order and/or User not saved to database', err);
  }

  // Build and send email
  try {
    const message = buildConfirmationEmail(transaction);
    await config.mail.transporter.sendMail(message);
  } catch(err) {
    console.warn('\x1b[33m%s\x1b[0mWARNING: Error sending confirmation email (probably a bad email address)', err);
  }
}
