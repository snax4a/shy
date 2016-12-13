'use strict';
import angular from 'angular';
import routes from './cart.routes';
import uiRouter from 'angular-ui-router';

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
    // if(!this.Cart.clientToken) {
    //   this.Cart.braintreeGetToken()
    //     .then
    // }

    // Chain to get a hostedFieldsInstance and log it
    this.Cart.braintreeGetToken()
      .then(this.Cart.braintreeClientCreate)
    /*
      .then(clientInstance => {
        this.clientInstance = clientInstance;
        this.$log.info('clientInstance', clientInstance);
      })
    */
      .then(this.Cart.braintreeHostedFieldsCreate)
    /*
      .then(this.Cart.braintreeHostedFieldsTokenize)
      .then(payload => {
        this.$log.info('Nonce', payload.nonce);
      });
    */
      .then(hostedFieldsInstance => {
        // Assocate with Cart Service for check out time
        this.Cart.hostedFieldsInstance = hostedFieldsInstance;
      });

    // Set focus to the credit card number using $timeout (because fields are disabled now)
    let fieldToClick = this.$window.document.getElementById('labelCardNumber');
    this.$timeout(() => {
      fieldToClick.click();
    }, 1000);

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
