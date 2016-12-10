'use strict';
import angular from 'angular';
//import braintreeWeb from 'braintree-web';

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
  constructor($log, $window, $location, $http, ProductList) {
    // Setup dependency injections
    this.$log = $log;
    this.$window = $window;
    this.$location = $location;
    this.$http = $http;
    this.ProductList = ProductList;

    // Stuff to initialize
    this.key = 'cart'; // name of local storage key
    this.cartItems = [];
    this.paymentInfo = {}; // REMOVE THIS
    this.purchaser = {};
    this.recipient = {};
    this.confirmation = {};
  }

  // Clear the cartItems during checkout()
  clearCartItems() {
    this.cartItems = []; // Clear the array of Items
    localStorage.removeItem(this.key);
  }

  // Add a product to the cart
  addItem(id) {
    let inCart = this.getItemById(id);
    if(typeof inCart === 'object') { // then it is in the cart already
      // Increment the quantity instead of starting at 1
      inCart.quantity += 1;
    } else {
      let product = this.ProductList.lookup(id);
      this.cartItems.push(new Item(id, product.name, product.price, 1));
    }
    this.saveToStorage();
    this.$location.path('/cart');
  }

  // Post cart properties to server and handle response
  placeOrder() {
    // Send request for a token
    this.$http
      .get('api/token')
      .then(tokenResponse => {
        this.$log.info('tokenResponse', tokenResponse);
        const braintree = require('braintree-web');
        const client = braintree.api.Client({clientToken: tokenResponse.data.client_token});
        client.tokenizeCard({
          number: this.paymentInfo.ccNumber, // Not using Hosted Fields approach here
          expirationDate: this.paymentInfo.expDate // Not using Hosted Fields approach here
        }, (err, nonce) => {
          if(err) throw err; // Temporary - we can do better

          // Setup order info to be submitted (subset of Cart properties)
          let orderInformation = {
            nonceFromClient: nonce,
            //paymentInfo: this.paymentInfo,
            purchaser: this.purchaser,
            recipient: this.isGift ? this.recipient : this.purchaser,
            isGift: this.isGift || false,
            treatment: this.treatment,
            instructions: this.instructions,
            cartItems: this.cartItems
          };

          // Process the sale
          return this.$http
            .post('/api/order', orderInformation)
            .then(orderResponse => {
              // Copy the result to the cart's confirmation
              this.confirmation = orderResponse.data;
              this.confirmation.cartItems = [];
              angular.copy(this.cartItems, this.confirmation.cartItems); // Get rid of my only dependency on angular in the class

              // Clear the cart to avoid duplicate orders
              this.clearCartItems();

              // Pass the promise out for async handling in controller
              // Seems unneeded because of return on this.$http
              //return orderResponse;
            })
            .catch(orderResponse => {
              this.$log.error('Order failed', orderResponse.data);
              // Seems unneeded because of return on this.$http
              //return orderResponse;
            });
        });
      })
      .catch(response => {
        this.$log.error('Not able to get a token from the web server. Please make sure the server is running and connecting to Braintree.');
        return response;
      });
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
