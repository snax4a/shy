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
    //this.$watch = $watch;
    this.products = ProductList.products;
    this.Cart = Cart;
    this.hfState = {};
  }

  $onInit() {
    // Initialize here to guarantee bindings are assigned before using them

    // Create Braintree Hosted Fields
    this.Cart.braintreeGetToken()
      .then(this.Cart.braintreeClientCreate.bind(this.Cart))
      .then(this.Cart.braintreeHostedFieldsCreate.bind(this.Cart))
      .then(hostedFieldsInstance => {
        this.$log.info('hostedFieldsInstance', hostedFieldsInstance._state.fields);
        this.hfState = hostedFieldsInstance._state.fields; // hostedFieldsInstance.getState();
        // this.$watch('hfState', (newValue, oldValue) => {
        //   this.$log.info('newValue', newValue);
        //   this.$log.info('oldValue', oldValue);
        // });
        this.$log.info('Current Hosted Field State', this.hfState.fields);
      })
      .catch(err => this.$log.info('Error setting up Braintree Hosted Fields', err));

    // Wait a second then set the focus to the credit card number by clicking its label
    let fieldToClick = this.$window.document.getElementById('labelCardNumber');
    this.$timeout(() => {
      fieldToClick.click();
    }, 1000);

    this.purchaser = {};
    this.recipient = {
      state: 'PA' // Default
    };
    this.confirmation = {};
    this.confirmation.purchaser = {};
    this.confirmation.recipient = {};
    this.confirmation.cartItems = [];

    this.pageName = 'Shopping Cart'; // will change to 'Order Confirmation' later
    this.Cart.treatment = 'Email';

    // Dynamically link controller objects to the Cart
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
      /*
        .then(this.Cart.braintreeHostedFieldsTokenize.bind(this.Cart))
        .then(payload => {
          this.$log.info('Nonce', payload.nonce);
        });
      */
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
