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
  constructor($log, $window, $location, $http, $timeout, ProductList) {
    // Setup dependency injections
    this.$log = $log;
    this.$window = $window;
    this.$location = $location;
    this.$http = $http;
    this.$timeout = $timeout;
    this.ProductList = ProductList;

    // Stuff to initialize
    this.key = 'cart'; // name of local storage key
    this.cartItems = [];
    this.purchaser = {};
    this.recipient = {};
    this.confirmation = {};
    this.hostedFieldsState = {};

    // Pre-fetch the clientInstance so the Hosted Fields display faster
    this.braintreeGetToken()
      .then(this.braintreeClientCreate.bind(this))
      .catch(err => this.$log.info('Error setting up Braintree client instance.', err));
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
    if(this.clientInstance) return new Promise(resolve => resolve(this.clientInstance));

    // Otherwise, get the promise to a clientInstance
    return new Promise((resolve, reject) => {
      braintree.client.create({authorization: token}, (clientErr, clientInstance) => { // ESLint can't handle the proper ES6 syntax (arrow function and no return statement)
        if(clientErr) {
          this.$log.error('Not able to create a client instance with Braintree. Make sure the token is being generated correctly.', clientErr);
          return reject(clientErr);
        } else {
          this.clientInstance = clientInstance; // hold on to it for successive requests
          return resolve(clientInstance);
        }
      });
    });
  }

  braintreeUpdateHostedFieldsState() {
    this.hostedFieldsState = this.hostedFieldsInstance.getState().fields;
    // Add isInvalid to simplify use of ng-messages
    this.hostedFieldsState.cvv.isInvalid = !this.hostedFieldsState.cvv.isValid;
    this.hostedFieldsState.expirationDate.isInvalid = !this.hostedFieldsState.expirationDate.isValid;
    this.hostedFieldsState.number.isInvalid = !this.hostedFieldsState.number.isValid;
    this.hostedFieldsState.isInvalid = this.hostedFieldsState.cvv.isInvalid || this.hostedFieldsState.number.isInvalid || this.hostedFieldsState.number.isInvalid;
  }

  braintreeHostedFieldsEventHandlers(eventNameArray) {
    for(let eventName of eventNameArray) {
      this.hostedFieldsInstance.on(eventName, event => {
        // const fieldName = event.emittedBy;
        // const field = event.fields[fieldName];
        // Make event handlers run digest cycle using $timeout (simulate $scope.apply())
        // In Angular 2, use zones
        this.$timeout(() => {
          this.braintreeUpdateHostedFieldsState();
          return event;
        });
      });
    }
  }

  // Returns a promise for the hostedFieldsInstance
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
            placeholder: '10/2020'
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
      }, (hostedFieldsErr, hostedFieldsInstance) => {
        // Handle disposition of promise
        if(hostedFieldsErr) {
          this.$log.error('Not able to create the hosted fields with Braintree.', hostedFieldsErr);
          return reject(hostedFieldsErr);
        } else {
          this.hostedFieldsInstance = hostedFieldsInstance;
          this.braintreeHostedFieldsEventHandlers(['blur', 'focus', 'validityChange', 'notEmpty', 'empty']);
          return resolve(hostedFieldsInstance);
        }
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

  // Return a promise to the confirmation
  _postOrderInformation(payload) {
    // Order info to be submitted (subset of Cart properties)
    const orderInformation = {
      nonceFromClient: payload.nonce,
      purchaser: this.purchaser,
      recipient: this.isGift ? this.recipient : this.purchaser,
      isGift: this.isGift || false,
      sendVia: this.sendVia,
      instructions: this.instructions,
      cartItems: this.cartItems // reference but it's being posted anyway
    };

    // Now POST it to /api/order
    return this.$http
      .post('/api/order', orderInformation)
      .then(orderResponse => {
        // Copy response data to the cart's confirmation
        this.confirmation = orderResponse.data;
        this.confirmation.cartItems = [];

        // Create a deep copy of the Cart's items into the confirmation
        angular.copy(this.cartItems, this.confirmation.cartItems);

        // Clear the cart to avoid duplicate orders
        this.clearCartItems();
      })
      .catch(orderResponse => {
        this.$log.error('Order failed', orderResponse.data);
      });
  }

  // Return a promise to the orderConfirmation
  placeOrder() {
    // Now, tokenize hosted fields to get nonce then post the order
    return this.braintreeHostedFieldsTokenize(this.hostedFieldsInstance)
      .then(this._postOrderInformation.bind(this))
      .catch(); // Add some error handling passing info back to cart component
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
