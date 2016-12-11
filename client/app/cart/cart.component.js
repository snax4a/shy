'use strict';
import angular from 'angular';
import routes from './cart.routes';
import uiRouter from 'angular-ui-router';
import braintree from 'braintree-web';

export class CartController {
  /*@ngInject*/
  constructor($log, $http, $window, $timeout, ProductList, Cart) {
    // Dependency injection
    this.$log = $log;
    this.$http = $http;
    this.$window = $window;
    this.$timeout = $timeout;
    this.products = ProductList.products;
    this.Cart = Cart;
  }

  $onInit() {
    // Initialize here to guarantee bindings are assigned before using them

    /* No longer using this.paymentInfo b/c Braintree hosted fields - REMOVE
    this.paymentInfo = {
      // Test data
      ccNumber: '4111111111111111',
      ccExpMonth: 12,
      ccExpYear: 20,
      ccCSC: 656
    };
    */
    // Setup Braintree Hosted Fields
    //braintree.client.create({authorization: this.Cart.token}, this._cbClientCreate);

    // Setup Braintree Hosted Fields
    this.$log.info('Setting up Braintree Hosted Fields', this.Cart.clientInstance);
    // This needs to happen after braintree.client.create does a callback
    //braintree.hostedFields.create(this._hostedFieldsOptions, this._cbHostedFieldsCreate);
    // this.Cart.clientInstance
    //   .then(() => {
    //     this.$log.info('this.clientInstance', this.Cart.clientInstance);
    //   })
    //   .catch();
    this.purchaser = {
    /*
      // Test data
      firstName: 'John',
      lastName: 'Doe',
      zipCode: '15222',
      email: 'john.doe@bitbucket.com',
      phone: '412-555-1212'
    */
    };
    this.recipient = {
    /*
      // Test data
      firstName: 'Jane',
      lastName: 'Doe',
      zipCode: '15222',
      email: 'jane.doe@bitbucket.com',
      phone: '724-555-1212',
    */
      state: 'PA' // Default
    };
    this.confirmation = {};
    this.confirmation.purchaser = {};
    this.confirmation.recipient = {};
    this.confirmation.cartItems = [];

    this.pageName = 'Shopping Cart'; // will change to 'Order Confirmation' later
    this.Cart.treatment = 'Email';

    // Dynamically link controller objects to the Cart
    this.Cart.paymentInfo = this.paymentInfo;
    this.Cart.purchaser = this.purchaser;
    this.Cart.recipient = this.recipient;
  }

    // Kind of a violation of separation of concerns but that's the way Braintree's API works
  _hostedFieldsOptions() {
    return {
      client: this.Cart.clientInstance,
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
          placeholder: '10/2019'
        }
      },
      styles: {
        input: {
          'font-size': '14px',
          'font-family': 'Helvetica Neue, Helvetica, Arial, sans-serif',
          'color': '#555'
        },
        ':focus': {
          'border-color': '#66afe9'
        },
        'input.invalid': {
          'color': 'red'
        },
        'input.valid': {
          'color': 'green'
        }
      }
    };
  }

  // Callback for braintree.hostedFields.create
  _cbHostedFieldsCreate(hostedFieldsErr, hostedFieldsInstance) {
    // Handle any errors
    if(hostedFieldsErr) {
      this.$log.info('Error with hosted fields', hostedFieldsErr);
      return;
    }

    // Tokenize the hosted fields
    this.$log.info('Tokenizing hosted fields');
    hostedFieldsInstance.tokenize(this._cbHostedFieldsTokenize);
  }

  _cbHostedFieldsTokenize(tokenizeErr, payload) {
    // Handle any errors
    if(tokenizeErr) {
      this.$log.info('Error tokenizing hosted fields', tokenizeErr);
      return;
    }
    this.$log.info('Nonce', payload.nonce); // Is it the same as the token?
  }

  // Update the quantity only if it's an acceptable value
  updateQuantity(oldValue, cartItem) {
    if(cartItem.quantity === undefined) {
      cartItem.quantity = parseInt(oldValue, 10); // revert and don't saveToStorage()
    } else this.Cart.saveToStorage();
  }

  // Go to previous page
  keepShopping() {
    this.$window.history.back();
  }

  // Set the focus to the credit card number field
  checkOut() {
     // Set focus to card-number (hosted field) if we can (in an iframe so maybe not)
     // If not, remove this method
    let fieldToGetFocus = this.$window.document.getElementById('card-number');
    fieldToGetFocus.focus();
  }

  // Handle when the order has a different recipient
  isGift() {
    // Set focus to recipientFirstName using $timeout (because fields are disabled now)
    let fieldToGetFocus = this.$window.document.getElementById('recipientFirstName');
    this.$timeout(() => {
      fieldToGetFocus.focus();
    }, 50);
  }

  // Initiate the order process
  placeOrder(form) {
    if(form.$valid) {
      // Implement: Change cursor to beach ball
      // Handle order confirmation via promise
      let orderPromise = this.Cart.placeOrder();
      orderPromise.then(result => {
        if(result.data.resultCode == 0) {
          this.$log.info('Successful order', this.Cart);
          this.pageName = 'Order Confirmation';
          // Clear credit card fields (or possibly other children of this.Cart)
          // this.paymentInfo = {}; // only if super-paranoid
          form.$setPristine(); // treat the fields as untouched
        } else {
          form.$submitted = false; // Re-enables the Place Order button
          this.$log.info(`Order Error ${this.confirmation.resultCode}`, this.Cart);
          this.pageName = 'Shopping Cart'; // changes view back
          // Put the error in the credit card number area (ng-message='paymentgateway')
        }
        // Implement: Change cursor to arrow
      });
    }
  }
}

export default angular.module('shyApp.cartPage', [uiRouter])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
