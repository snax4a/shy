'use strict';
import angular from 'angular';
import routes from './checkout.routes';
import ngRoute from 'angular-route';

export class CheckOutComponent {
  /*@ngInject*/
  constructor($log, $http, $window, $timeout, $location, ProductList, Cart) {
    // Dependencies
    this.$log = $log;
    this.$http = $http;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$location = $location;
    this.products = ProductList.products;
    this.Cart = Cart;
  }

  $onInit() {
    // Create Braintree Hosted Fields
    // NOTE: if checkout is displayed and page is refreshed /api/token will be called 2x (here and from Cart service)
    // TODO: wait for Cart service to finish constructor()
    this.Cart.braintreeHostedFieldsCreate()
      .catch(braintreeError => this.$log.error('Error setting up Braintree Hosted Fields', braintreeError));

    // Wait a second then set the focus to the credit card number by clicking its label
    this.$timeout(() => {
      this.focusOnCardNumber();
    }, 1000);

    // Defaults
    this.buttonDisabled = false;
    this.purchaser = {};
    this.recipient = {
      state: 'PA' // Default
    };
    this.Cart.sendVia = 'Email';
    this.Cart.instructions = '';

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

  focusOnField(id) {
    this.$window.document.getElementById(id).click();
  }

  // Set the focus to the credit card number field
  focusOnCardNumber() {
    this.focusOnField('labelCardNumber');
  }

  // Handle when the order has a different recipient
  focusOnRecipient() {
    // Set focus to recipientFirstName using $timeout (because fields are disabled now)
    this.$timeout(() => {
      this.focusOnField('recipientFirstName');
    }, 50);
  }

  // Attempt to checkout with Apple Pay. Pass or fail - send the user to the home page since we won't show the confirmation for them.
  applePayCheckout() {
    this.Cart.applePayCheckout();
    this.$location.path('/checkout'); // Move to the checkout page to provide other options
  }

  // Handle component form submit - call service to place order (cannot be an async function)
  async placeOrder(form) {
    this.buttonDisabled = true;
    if(form.$valid) {
      try {
        await this.Cart.placeOrder();
        // Use $timeout so it's within the digest cycle
        this.$timeout(() => this.$location.path('/confirmation'));
      } catch(err) {
        console.log('Error in checkout.component.js:placeOrder()', err);
        this.braintreeError = err.statusText; // for view data-binding
        this.Cart.hostedFieldsState.number.isInvalid = true;
        this.buttonDisabled = false;
        if(this.braintreeError.includes('card')) this.focusOnCardNumber();
      }
    } // form.$valid
  } // placeOrder
} // class CheckOutController

export default angular.module('shyApp.checkout', [ngRoute])
  .config(routes)
  .component('checkout', {
    template: require('./checkout.pug'),
    controller: CheckOutComponent
  })
  .name;
