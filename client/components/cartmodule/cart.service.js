'use strict';
import braintreeClient from 'braintree-web/client';
import braintreeHostedFields from 'braintree-web/hosted-fields';
import braintreeApplePay from 'braintree-web/apple-pay';

class Item {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  // Calculate the item total
  getTotal() {
    return parseFloat(this.quantity * this.price.toFixed(0));
  }
}

export class Cart {
  /*@ngInject*/
  constructor($log, $window, $location, $http, $timeout, $q, ProductList) {
    // Setup dependency injections
    this.$log = $log;
    this.$window = $window;
    this.$location = $location;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$q = $q;
    this.ProductList = ProductList;

    // Initialize members
    this.key = 'cart'; // name of local storage key
    this.initializeProperties();

    // Pre-fetch the clientInstance so the Hosted Fields display faster
    // and set this.applePayEnabled to display buttons if appropriate
    this.braintreeGetToken()
      .then(this.braintreeClientCreate.bind(this))
      .then(this.applePayCapabilityCheck.bind(this))
      .catch(braintreeError => this.$log.info('Error setting up Braintree client instance or checking for Apple Pay support.', braintreeError));
  }

  initializeProperties() {
    this.cartItems = [];
    this.purchaser = {};
    this.recipient = {};
    this.instruction = '';
    this.gift = false;
    this.sendVia = 'Email';
    this.hostedFieldsState = {};
  }

  // Check to see whether Apple Pay is supported on the device so we know whether to display buttons
  applePayPossible() {
    try {
      return window.ApplePaySession && window.ApplePaySession.canMakePayments();
    } catch(err) { // Triggered by attempting Apple Pay on HTTP rather than HTTPS (ie dev)
      return false;
    }
  }

  applePayCapabilityCheck(clientInstance) {
    if(this.applePayPossible()) {
      return this.braintreeApplePayInstanceCreate(clientInstance)
        .then(applePayInstance => applePayInstance.merchantIdentifier)
        .then(window.ApplePaySession.canMakePaymentsWithActiveCard)
        .then(canMakePaymentsWithActiveCard => {
          // Set property that enables buttons because there's at least one credit card tied to Apple Pay
          this.applePayEnabled = canMakePaymentsWithActiveCard;
        })
        .catch();
    }
  }

  // Convert this.cartItem values to Apple Pay lineItems
  applePayLineItems() {
    let lineItems = [];
    for(let item of this.cartItems) {
      lineItems.push({
        type: 'final',
        label: `${item.quantity}x ${item.name}`,
        amount: item.getTotal()
      });
    }
    return lineItems;
  }

  // Returns applePaymentRequest with our defaults
  applePayCreatePaymentRequest() {
    return this.applePayInstance.createPaymentRequest({
      // For now, Apple ignores the last two items
      requiredBillingContactFields: ['name', 'postalAddress', 'phone', 'email'],
      // Apple restricts phone and email to shippingContact (hopefully will extend to billingContact someday)
      requiredShippingContactFields: ['name', 'postalAddress', 'phone', 'email'],
      shippingMethods: [
        {
          label: 'Purchased for myself.',
          detail: 'Register under my name.',
          amount: '0.00',
          identifier: 'Email'
        },
        {
          label: 'This is a gift.',
          detail: 'Email to shipping contact.',
          amount: '0.00',
          identifier: 'Gift-Email'
        },
        {
          label: 'This is a gift',
          detail: 'Mail to shipping contact',
          amount: '0.00',
          identifier: 'Gift-Mail'
        },
        {
          label: 'This is a gift.',
          detail: 'Mail to me.',
          amount: '0.00',
          identifier: 'Gift-Mail'
        }
      ],
      lineItems: this.applePayLineItems(),
      total: {
        label: 'Schoolhouse Yoga',
        amount: this.getTotalCost()
      }
    });
  }

  applePayGetPurchaserAndRecipient(paymentEvent) {
    // Until Apple supports billingContact.phoneNumber and emailAddress, use values from shippingContact
    this.purchaser = {
      firstName: paymentEvent.billingContact.givenName,
      lastName: paymentEvent.billingContact.familyName,
      email: paymentEvent.billingContact.emailAddress || paymentEvent.shippingContact.emailAddress,
      phone: paymentEvent.billingContact.phoneNumber || paymentEvent.shippingContact.phoneNumber,
      address: paymentEvent.billingContact.addressLines[0],
      city: paymentEvent.billingContact.locality,
      state: paymentEvent.billingContact.administrativeArea,
      zipCode: paymentEvent.billingContact.postalCode
    };
    this.recipient = {
      firstName: paymentEvent.shippingContact.givenName,
      lastName: paymentEvent.shippingContact.familyName,
      email: paymentEvent.shippingContact.emailAddress,
      phone: paymentEvent.shippingContact.phoneNumber,
      address: paymentEvent.shippingContact.addressLines[0],
      city: paymentEvent.shippingContact.locality,
      state: paymentEvent.shippingContact.administrativeArea,
      zipCode: paymentEvent.shippingContact.postalCode
    };
  }

  // Take contents of cart and checkout with Apple Pay
  applePayCheckout() {
    // Compose the applePayRequest using our defaults
    const applePaymentRequest = this.applePayCreatePaymentRequest();

    // Then send the request
    const session = new window.ApplePaySession(1, applePaymentRequest);

    // Callback to handle merchant validation from Apple
    session.onvalidatemerchant = event => {
      this.applePayInstance.performValidation({
        validationURL: event.validationURL,
        displayName: 'Schoolhouse Yoga, Inc.'
      }, (validationErr, merchantSession) => {
        if(validationErr) {
          this.$log.error('Error validating Apple Pay merchant:', validationErr);
          session.abort();
          return;
        }
        session.completeMerchantValidation(merchantSession);
      }); // this.applePayInstance.performValidation
    }; // session.onvalidatemerchant

    // Callback to handle selection of shipping method
    session.onshippingmethodselected = event => {
      this.gift = event.shippingMethod.identifier.startsWith('Gift');
      this.sendVia = event.shippingMethod.identifier.endsWith('Email') ? 'Email' : 'Mail';
      this.instructions = `${event.shippingMethod.label} ${event.shippingMethod.detail}`;
      // Not changing line items. Only using selection to set Cart properties.
      session.completeShippingMethodSelection(
        session.STATUS_SUCCESS,
        applePaymentRequest.total,
        applePaymentRequest.lineItems
      );
    };

    // Callback to handle payment authorized from Apple
    session.onpaymentauthorized = event => {
      this.applePayInstance.tokenize({ token: event.payment.token }, (tokenizeErr, payload) => {
        if(tokenizeErr) {
          this.$log.error('Error tokenizing Apple Pay:', tokenizeErr);
          session.completePayment(session.STATUS_FAILURE);
          return;
        }
        session.completePayment(session.STATUS_SUCCESS);

        // Get this.purchaser and this.recipient from event.payment
        this.applePayGetPurchaserAndRecipient(event.payment);

        // Post the order and handle errors
        this.postOrderInformation(payload);
      });
    }; // session.onpaymentauthorized

    // Show the payment sheet on the device
    session.begin();
  }

  // Immediate Apple Pay purchase with fallback to standard process
  applePayBuyItem(productID) {
    if(this.applePayEnabled) {
      // Set defaults to match initial shippingMethod (since it doensn't fire an event)
      this.gift = false;
      this.sendVia = 'Email';
      this.instructions = 'This purchase is for myself';

      // Only one cart item for Apple Pay purchases - suppress navigation to Cart page
      this.addItem(productID, true);

      // Complete the Apple Pay checkout process
      this.applePayCheckout();
    } else this.addItem(productID); // fallback to regular cart behavior with navigation to cart page
  }

  // Returns a promise for the token
  braintreeGetToken() {
    // If we already have one, return that
    if(this.clientToken) return this.$q(resolve => resolve(this.clientToken));

    // Otherwise, request one from the server
    return this.$http
      .get('api/token')
      .then(tokenResponse => {
        this.clientToken = tokenResponse.data;
        return tokenResponse.data;
      })
      .catch(tokenResponse => {
        this.$log.error('Not able to get a token from the web server. Please make sure the server is running and connecting to Braintree.', tokenResponse);
        return tokenResponse;
      });
  }

  // Returns a promise for the clientInstance
  braintreeClientCreate(token) {
    // If we already have one, return that
    if(this.clientInstance) return this.$q(resolve => resolve(this.clientInstance));

    // Otherwise, get the promise to a clientInstance
    return this.$q((resolve, reject) => {
      braintreeClient.create({authorization: token}, (clientErr, clientInstance) => { // ESLint can't handle the proper ES6 syntax (arrow function and no return statement)
        if(clientErr) {
          this.$log.error('Not able to create a client instance with Braintree. Make sure the token is being generated correctly.', clientErr);
          return reject(clientErr);
        } else {
          this.clientInstance = clientInstance; // hold on to it for successive requests
          return resolve(clientInstance);
        }
      });
    });
  }

  // Return a promise to an Apple Pay Instance, call braintreeClientCreate in chain prior (just in case)
  braintreeApplePayInstanceCreate(clientInstance) {
    if(this.applePayInstance) return this.$q(resolve => resolve(this.applePayInstance));

    // Otherwise, get the promise to an applePayInstance
    return this.$q((resolve, reject) => {
      braintreeApplePay.create({ client: clientInstance }, (applePayInstanceErr, applePayInstance) => {
        if(applePayInstanceErr) {
          this.$log.error('Not able to create an Apple Pay instance with Braintree. Make sure the client instance was setup correctly.');
          return reject(applePayInstanceErr);
        } else {
          this.applePayInstance = applePayInstance; // hold on to it for successive requests
          return resolve(applePayInstance);
        }
      });
    });
  }

  braintreeUpdateHostedFieldsState() {
    this.hostedFieldsState = this.hostedFieldsInstance.getState().fields;
    // Add isInvalid to simplify use of ng-messages
    this.hostedFieldsState.cvv.isInvalid = !this.hostedFieldsState.cvv.isValid;
    this.hostedFieldsState.expirationDate.isInvalid = !this.hostedFieldsState.expirationDate.isValid;
    this.hostedFieldsState.number.isInvalid = !this.hostedFieldsState.number.isValid;
    this.hostedFieldsState.isInvalid = this.hostedFieldsState.cvv.isInvalid || this.hostedFieldsState.number.isInvalid || this.hostedFieldsState.number.isInvalid;
  }

  braintreeHostedFieldsEventHandlers(eventNameArray) {
    for(let eventName of eventNameArray) {
      this.hostedFieldsInstance.on(eventName, event => {
        // const fieldName = event.emittedBy;
        // const field = event.fields[fieldName];
        // Make event handlers run digest cycle using $timeout (simulate $scope.apply())
        // In Angular 2, use zones
        this.$timeout(() => {
          this.braintreeUpdateHostedFieldsState();
          return event;
        });
      });
    }
  }

  // Returns a promise for the hostedFieldsInstance
  braintreeHostedFieldsCreate(clientInstance) {
    // hostedFieldsInstance must be created each time cart component is displayed
    // so can't reuse this.hostedFieldsInstance to cache it for performance reasons.
    // While you could argue this belongs in cart.component.js's, prefer Braintree code stay together.
    return this.$q((resolve, reject) => {
      braintreeHostedFields.create({
        client: clientInstance,
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: '10/2020'
          }
        },
        styles: {
          input: {
            'font-size': '14px',
            'font-family': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            color: '#555'
          },
          ':focus': {
            'border-color': '#66afe9'
          },
          'input.invalid': {
            color: '#a94442'
          },
          'input.valid': {
            color: 'green'
          }
        }
      }, (hostedFieldsErr, hostedFieldsInstance) => {
        // Handle disposition of promise
        if(hostedFieldsErr) {
          this.$log.error('Not able to create the hosted fields with Braintree.', hostedFieldsErr);
          return reject(hostedFieldsErr);
        } else {
          this.hostedFieldsInstance = hostedFieldsInstance;
          this.braintreeHostedFieldsEventHandlers(['blur', 'focus', 'validityChange', 'notEmpty', 'empty']);
          return resolve(hostedFieldsInstance);
        }
      });
    });
  }

  // Return a promise to the payload (containing the nonce)
  braintreeHostedFieldsTokenize(hostedFieldsInstance) {
    return this.$q((resolve, reject) => {
      hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
        return tokenizeErr ? reject(tokenizeErr) : resolve(payload);
      });
    });
  }

  // Return a promise to the confirmation
  postOrderInformation(payload) {
    // Order info to be submitted (subset of Cart properties)
    const orderInformation = {
      nonceFromClient: payload.nonce,
      purchaser: this.purchaser,
      recipient: this.gift ? this.recipient : this.purchaser,
      gift: this.gift || false,
      sendVia: this.sendVia,
      instructions: this.instructions,
      cartItems: this.cartItems // reference but it's being posted anyway
    };

    // Return promise from POST to /api/order
    return this.$http
      .post('/api/order', orderInformation)
      .then(orderResponse => {
        // Connect response data to the cart's confirmation (even if an ErrorResponse)
        this.confirmation = orderResponse.data;

        // If Braintree does not report success, throw error to controller so it can adjust view
        if(!orderResponse.data.success) throw orderResponse.data;

        // Clear the cart to avoid duplicate orders (only if successful though)
        this.clearCartItems();

        // Display confirmation
        return this.confirmation;
      });
  }

  // Return a promise to the orderConfirmation
  placeOrder() {
    // Tokenize hosted fields to get nonce then post the order
    return this.braintreeHostedFieldsTokenize(this.hostedFieldsInstance) // returns payload containing nonce
      .then(this.postOrderInformation.bind(this));
      //.catch(); // Catch errors in cart.component.js since they affect the view
  }

  // Clear the cartItems during checkout()
  clearCartItems() {
    this.initializeProperties();
    localStorage.removeItem(this.key);
  }

  // Add a product to the cart
  addItem(id, navigationDisabled) {
    this.confirmation = undefined;
    let inCart = this.getItemById(id);
    if(typeof inCart === 'object') { // then it is in the cart already
      // Increment the quantity instead of starting at 1
      inCart.quantity += 1;
    } else {
      let product = this.ProductList.lookup(id);
      this.cartItems.push(new Item(id, product.name, product.price, 1));
    }
    this.saveToStorage();
    if(!navigationDisabled) this.$location.path('/checkout');
  }

  // Get item by its id
  getItemById(id) {
    for(let cartItem of this.cartItems) {
      if(cartItem.id == id) {
        return cartItem;
      }
    }
  }

  // Sum of quantities in the Cart, used by navbar badge and cart page header panel
  getTotalItems() {
    let count = 0;
    // Native way
    for(let cartItem of this.cartItems) {
      count += cartItem.quantity;
    }
    return count;
  }

  // Get the unique number of products in the Cart, not used yet
  getTotalUniqueItems() {
    return this.cartItems.length;
  }

  // Calculate the total cost of all items
  getTotalCost() {
    let total = 0;
    for(let cartItem of this.cartItems) {
      total += cartItem.getTotal();
    }
    return parseFloat(total).toFixed(0);
  }

  // Remove CartItem by index used in cart.pug
  removeItem(index) {
    this.cartItems.splice(index, 1);
    this.saveToStorage();
  }

  // Remove CartItem by id, not used currently
  removeItemById(id) {
    for(let index in this.cartItems) {
      if(this.cartItems[index].id === id) {
        this.cartItems.splice(index, 1);
        break;
      }
    }
    this.saveToStorage();
  }

  // Checks whether cart is empty, used on Cart Page to display empty cart message
  isEmpty() {
    return this.cartItems.length == 0;
  }

  // Load Cart from local storage during CartRun
  loadFromStorage() {
    let storedItems = false;
    let retrievedValue = this.$window.localStorage[this.key];
    if(retrievedValue) {
      storedItems = JSON.parse(retrievedValue);
    }
    if(typeof storedItems === 'object') {
      for(let item of storedItems) {
        this.cartItems.push(new Item(item.id, item.name, item.price, item.quantity));
      }
    }
  }

  // Save Cart to local storage
  saveToStorage() {
    let valueToStore = JSON.stringify(this.cartItems);
    this.$window.localStorage[this.key] = valueToStore;
  }

}
