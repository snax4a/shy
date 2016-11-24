'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  /*@ngInject*/
  constructor($log, $window, $timeout, ProductList, Cart) {
    this.$log = $log;
    this.$window = $window;
    this.$timeout = $timeout;
    this.pageName = '';
    // These have to be set here and not $onInit()
    this.products = ProductList.products;
    this.Cart = Cart;
    this.confirmation = {};
    this.confirmation.purchaser = {};
    this.confirmation.recipient = {};
    this.confirmation.cartItems = [];
  }

  // Starts the binding (works in constructor but better practice to put here)
  $onInit() {
    this.pageName = 'Shopping Cart'; // will change to 'Order Confirmation' later

    // Implement: Remove test data before go-live
    this.paymentInfo = {
      ccNumber: '4111111111111111',
      ccExpMonth: 12,
      ccExpYear: 2020,
      ccCSC: 656
    };
    this.purchaser = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'Pittsburgh',
      state: 'PA',
      zipCode: '15222',
      email: 'jdoe@gmail.com',
      phone: '412-555-1212'
    };

    // Copy initial purchaser values to recipient
    this.recipient = {};
    angular.copy(this.purchaser, this.recipient);

    // Dynamically link controller objects to the Cart
    this.Cart.paymentInfo = this.paymentInfo;
    this.Cart.purchaser = this.purchaser;
    this.Cart.recipient = this.recipient;

    // Populate the months array
    this.months = [];
    for(let i = 1; i < 13; i++) {
      this.months.push(i);
    }

    // Populate the years array
    this.years = [];
    let currentYear = new Date().getFullYear();
    for(let i = currentYear; i < currentYear + 10; i++) {
      this.years.push(i);
    }

    // Populate states array - not needed elsewhere so avoid separate JSON file
    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI',
      'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS',
      'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW',
      'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
    this.Cart.forSomeoneElse = false;
    this.Cart.methodToSend = 'Apply credit to recipient\'s account (default)';
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

  // As we enter the billing info, copy to recipient fields
  updateRecipient() {
    if(!this.Cart.forSomeoneElse) angular.copy(this.purchaser, this.recipient);
  }

  // Handle when the order has a different recipient
  forSomeoneElse() {
    // Clear fields that must be different (leave last name in case family member)
    this.recipient.firstName = '';
    this.recipient.email = '';
    this.recipient.phone = '';

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
          // Implement: fix binding to this.Cart.confirmation on cart.pug
          // Clear credit card fields (or possibly other children of this.Cart)
          // this.paymentInfo = {}; // only if super-paranoid
          form.$setPristine(); // treat the fields as untouched
        } else {
          this.$log.info(`Order Error ${this.confirmation.resultCode}`, this.Cart);
          this.pageName = 'Shopping Cart'; // changes view back
          // Put the error in the credit card number area (ng-message='paymentgateway')
        }
        // Implement: Change cursor to arrow
      });
    }
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
