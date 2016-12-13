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
    // If we already have one, return that
    if(this.clientToken) return new Promise(resolve => resolve(this.clientToken));

    // Otherwise, request one from the server
    return this.$http
      .get('api/token')
      .then(tokenResponse => {
        this.clientToken = tokenResponse.data;
        return tokenResponse.data;
      })
      .catch(tokenResponse => {
        this.$log.error('Not able to get a token from the web server. Please make sure the server is running and connecting to Braintree.', tokenResponse);
        return tokenResponse;
      });
  }

  // Returns a promise for the clientInstance
  braintreeClientCreate(token) {
    // If we already have one, return that
    //if(this.clientInstance) return new Promise(resolve => resolve(this.clientInstance));

    // Otherwise, get the promise to a clientInstance
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
            color: '#555'
          },
          ':focus': {
            'border-color': '#66afe9'
          },
          'input.invalid': {
            color: 'red'
          },
          'input.valid': {
            color: 'green'
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

  // Return a promise to the confirmation
  _postOrderInformation(orderInformation) {
    return this.$http
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

  // Returns a promise to the orderInformation
  _getOrderInformation(payload) {
    return new Promise((resolve, reject) => {
      if(payload) {
        resolve({
          // Order info to be submitted (subset of Cart properties)
          nonceFromClient: payload.nonce,
          //paymentInfo: this.paymentInfo, // Not using this any longer (remove all references to it)
          purchaser: this.purchaser,
          recipient: this.isGift ? this.recipient : this.purchaser,
          isGift: this.isGift || false,
          treatment: this.treatment,
          instructions: this.instructions,
          cartItems: this.cartItems
        });
      } else {
        reject('Error creating orderInformation');
      }
    });
  }

  // Return a promise to the orderConfirmation
  placeOrder() {
    // cart.component controller sets this.hostedFieldsInstance in $onInit()
    // Now, tokenize hosted fields to get nonce then process the sale
    // Perhaps add return to next line to return the promise from the chain?
    this.braintreeHostedFieldsTokenize(this.hostedFieldsInstance)
      .then(this._getOrderInformation)
      .then(this._postOrderInformation)
      .then();
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
