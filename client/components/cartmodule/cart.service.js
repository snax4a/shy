'use strict';
import angular from 'angular';

class Item {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  // Calculate the item total
  getTotal() {
    return parseFloat(this.quantity * this.price.toFixed(2));
  }
}

export class Cart {
  /*@ngInject*/
  constructor($log, $window, $location, $http, ProductList) {
    this.$log = $log;
    this.$window = $window;
    this.$location = $location;
    this.$http = $http;
    this.key = 'cart'; // name of local storage key
    this.ProductList = ProductList;
    this.cartItems = [];
    this.paymentInfo = {};
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
      let newItem = new Item(id, product.name, product.price, 1);
      this.cartItems.push(newItem);
    }
    this.saveToStorage();
    this.$location.path('/cart');
  }

  // Post cart properties to server and handle response
  placeOrder() {
    // Send a subset of the Cart's properties
    let orderInformation = {
      paymentInfo: this.paymentInfo,
      purchaser: this.purchaser,
      recipient: this.recipient,
      forSomeoneElse: this.forSomeoneElse,
      methodToSend: this.methodToSend,
      instructions: this.instructions,
      cartItems: this.cartItems
    };

    // Setup handler for promise once order is processed
    return this.$http.post('/api/order/place', orderInformation)
      .success(result => {
        // Copy the result to the cart's confirmation
        this.confirmation = result; // Previously: angular.copy(result, this.confirmation);
        this.confirmation.cartItems = [];
        angular.copy(this.cartItems, this.confirmation.cartItems); // Get rid of my only dependency on angular in the class

        // Clear the cart to avoid duplicate orders
        this.clearCartItems();

        // Pass the promise out for async handling in controller
        return result;
      })
      .error(err => {
        this.$log.error('Order failed', err);
        return err;
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
    return parseFloat(total).toFixed(2);
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
