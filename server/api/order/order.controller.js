/*
 POST    /api/order ->  placeOrder
*/
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
  return parseFloat(total).toFixed(0);
}

/*
import jsonpatch from 'fast-json-patch';
import {Thing} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
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

// Creates a new Thing in the DB
export function create(req, res) {
  return Thing.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}
*/
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

  // Build block of HTML for cartItems
  let cartItemsHtml = '';
  cartItems.forEach(cartItem => {
    cartItemsHtml += `<tr><td class="left">${cartItem.name}</td><td class="center">${cartItem.quantity}</td>
      <td class="right">$${cartItem.price}</td><td class="right">$${getTotal(cartItem)}</td></tr>`;
  });

  // Send email confirmation to the purchaser and BCC SHY admin
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
                    Placed on ${confirmation.placedOn}<br />
                    Card number ${confirmation.ccNumber}
                  </p>
                  <table style="width:100%;margin-top:20px;">
                    <tr style="vertical-align:top;">
                      <td>
                        <b>Purchaser</b><br/>
                        ${confirmation.purchaser.firstName} ${confirmation.purchaser.lastName}<br />
                        ${confirmation.purchaser.address}<br/>
                        ${confirmation.purchaser.city}, ${confirmation.purchaser.state} ${confirmation.purchaser.zipCode}<br />
                        ${confirmation.purchaser.phone}<br/>
                        ${confirmation.purchaser.email}
                      </td>
                      <td>
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
              Gift: ${(confirmation.forSomeoneElse ? 'Yes' : 'No')}<br />
              ${confirmation.methodToSend}<br />
              ${(confirmation.instructions !== undefined ? confirmation.instructions : '')}
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
