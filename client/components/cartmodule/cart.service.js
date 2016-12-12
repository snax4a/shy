'use strict';
import angular from 'angular';
import braintree from 'braintree-web';

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
    // this.paymentInfo = {}; // REMOVE THIS
    this.purchaser = {};
    this.recipient = {};
    this.confirmation = {};
  }

  // Maybe break out the next 4 methods into their own angular service

  // Returns a promise for the token
  braintreeGetToken() {
    return this.$http
      .get('api/token')
      .then(tokenResponse => tokenResponse.data)
      .catch(tokenResponse => {
        this.$log.error('Not able to get a token from the web server. Please make sure the server is running and connecting to Braintree.', tokenResponse);
        return tokenResponse;
      });
  }

  // Returns a promise for the clientInstance
  braintreeClientCreate(token) {
    return new Promise((resolve, reject) => {
      braintree.client.create({authorization: token}, function(clientErr, clientInstance) { // ESLint can't handle the proper ES6 syntax (arrow function and no return statement)
        return clientErr ? reject(clientErr) : resolve(clientInstance);
      });
    });
  }

  // Returns a promise for the hostedFieldsInstance
  // Unfortunately, it violates separation of concerns but it's Braintree's API
  braintreeHostedFieldsCreate(clientInstance) {
    return new Promise((resolve, reject) => {
      braintree.hostedFields.create({
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
      }, function(hostedFieldsErr, hostedFieldsInstance) {
        return hostedFieldsErr ? reject(hostedFieldsErr) : resolve(hostedFieldsInstance);
      });
    });
  }

  // Return a promise to the payload (for submitting orders)
  braintreeHostedFieldsTokenize(hostedFieldsInstance) {
    return new Promise((resolve, reject) => {
      hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
        return tokenizeErr ? reject(tokenizeErr) : resolve(payload);
      });
    });
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

  _processSale(orderInformation) {
    this.$http
      .post('/api/order', orderInformation)
      .then(orderResponse => {
        // Copy response data to the cart's confirmation
        this.confirmation = orderResponse.data;
        this.confirmation.cartItems = [];
        angular.copy(this.cartItems, this.confirmation.cartItems); // Implement: Get rid of my only dependency on angular in the class

        // Clear the cart to avoid duplicate orders
        this.clearCartItems();
      })
      .catch(orderResponse => {
        this.$log.error('Order failed', orderResponse.data);
      });
  }

  _cbHostedFieldsTokenize(tokenizeErr, payload) {
    // Handle any errors
    if(tokenizeErr) {
      this.$log.info('Error tokenizing hosted fields', tokenizeErr);
      return;
    }

    // Order info to be submitted (subset of Cart properties)
    let orderInformation = {
      nonceFromClient: payload.nonce,
      //paymentInfo: this.paymentInfo, // Not using this any longer (remove all references to it)
      purchaser: this.purchaser,
      recipient: this.isGift ? this.recipient : this.purchaser,
      isGift: this.isGift || false,
      treatment: this.treatment,
      instructions: this.instructions,
      cartItems: this.cartItems
    };

    // Process the sale
    this._processSale(orderInformation);
  }

  // Post cart properties to server and handle response
  placeOrder() {
    // GET /api/token -> create client -> create hosted fields -> tokenize hosted fields -> processSale
    this.$http
      .get('api/token')
      .then(tokenResponse => {
        // const braintree = require('braintree-web');
        braintree.client.create({authorization: tokenResponse.data}, this._cbClientCreate);
      })
      .catch(tokenResponse => {
        this.$log.error('Not able to get a token from the web server. Please make sure the server is running and connecting to Braintree.');
        return tokenResponse;
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
