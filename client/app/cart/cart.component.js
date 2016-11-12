'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  /*@ngInject*/
  constructor($log, $window, ProductList, Cart) {
    this.$log = $log;
    this.$window = $window;
    // These have to be set here and not $onInit()
    this.products = ProductList.products;
    this.Cart = Cart;
  }

  // Starts the binding (works in constructor but better practice to put here)
  $onInit() {
    this.checkOutInfo = {
      ccExpMonth: 'Month',
      ccExpYear: 'Year',
      state: 'PA',
      recipientState: 'PA'
    };
    this.months = [];
    for(let i = 1; i < 13; i++) {
      this.months.push(i);
    }
    this.years = [];
    let currentYear = new Date().getFullYear();
    for(let i = currentYear; i < currentYear + 10; i++) {
      this.years.push(i);
    }
    // Not needed elsewhere so avoid separate JSON file
    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI',
      'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS',
      'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW',
      'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
    this.checkOutInfo.forSomeoneElse = false;
    this.checkOutInfo.methodToSend = 'Apply credit to recipient\'s account (default)';
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
    if(!this.checkOutInfo.forSomeoneElse) {
      this.checkOutInfo.recipientFirstName = this.checkOutInfo.ccFirstName;
      this.checkOutInfo.recipientLastName = this.checkOutInfo.ccLastName;
      this.checkOutInfo.recipientAddress = this.checkOutInfo.streetAddress;
      this.checkOutInfo.recipientCity = this.checkOutInfo.city;
      this.checkOutInfo.recipientState = this.checkOutInfo.state;
      this.checkOutInfo.recipientZipCode = this.checkOutInfo.zipCode;
      this.checkOutInfo.recipientEmail = this.checkOutInfo.email;
      this.checkOutInfo.recipientPhone = this.checkOutInfo.phone;
    }
  }

  // Handle when the order has a different recipient
  forSomeoneElse() {
    // Clear fields that must be different (leave last name in case family member)
    this.checkOutInfo.recipientFirstName = '';
    this.checkOutInfo.recipientEmail = '';
    this.checkOutInfo.recipientPhone = '';

    // This will not work because the disabled state of the fieldset interferes
    // Set focus to recipientFirstName
    let fieldToGetFocus = this.$window.document.getElementById('recipientFirstName');
    fieldToGetFocus.focus();
  }

  // Initiate the order process
  placeOrder() {
    this.$log.info(this.checkOutInfo);
    //this.Cart.placeOrder(this.checkOutInfo);
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
