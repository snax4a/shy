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

    // Create Braintree Hosted Fields
    this.Cart.braintreeGetToken()
      .then(this.Cart.braintreeClientCreate.bind(this.Cart))
      .then(this.Cart.braintreeHostedFieldsCreate.bind(this.Cart))
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

    this.pageName = 'Shopping Cart'; // will change to 'Order Confirmation' later
    this.Cart.sendVia = 'Email';

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
  focusOnCardNumber() {
    // Set focus to card-number (hosted field) if we can (in an iframe so maybe not)
    // If not, remove this method
    let fieldToGetFocus = this.$window.document.getElementById('labelCardNumber');
    fieldToGetFocus.click();
  }

  // Handle when the order has a different recipient
  focusOnRecipient() {
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
      return this.Cart.placeOrder()
        .then(braintreeSaleResponse => {
          // Shorten the references a little for easier viewing
          this.confirmation = braintreeSaleResponse.transaction;

          this.braintreeError = undefined; // in case of a follow up order
          this.pageName = 'Order Confirmation'; // displays confirmation
          form.$setPristine(); // treat the fields as untouched
          form.$submitted = false; // reset submitted state
          // Implement: Change cursor to arrow

          // Force a digest to run (am I overcoming a bug?)
          this.$timeout(() => this.pageName);
        })
        .catch(braintreeError => {
          form.$submitted = false; // reset submitted state
          this.braintreeError = braintreeError.message; // for view data-binding
          this.$log.info(`Braintree error: ${this.braintreeError}`, braintreeError);
          if(this.braintreeError.includes('card')) this.focusOnCardNumber();
        });
    } // form.$valid
  } // placeOrder

} // class CartController

export default angular.module('shyApp.cartPage', [uiRouter])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
