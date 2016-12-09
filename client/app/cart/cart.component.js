'use strict';
import angular from 'angular';
import routes from './cart.routes';
import uiRouter from 'angular-ui-router';

export class CartController {
  /*@ngInject*/
  constructor($log, $window, $timeout, ProductList, Cart) {
    // Angular services
    this.$log = $log;
    this.$window = $window;
    this.$timeout = $timeout;
    this.products = ProductList.products;
    this.Cart = Cart;
  }

  // Starts the binding (works in constructor but better practice to put here)
  $onInit() {
    // Set defaults for elements in the view
    this.paymentInfo = {
    /*
      // Test data
      ccNumber: '4111111111111111',
      ccExpMonth: 12,
      ccExpYear: 20,
      ccCSC: 656
    */
    };
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
     // Set focus to recipientFirstName
    let fieldToGetFocus = this.$window.document.getElementById('ccNumber');
    fieldToGetFocus.focus();
  }

  // Handle when the order has a different recipient
  isGift() {
    this.focusOnRecipient();
  }

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
