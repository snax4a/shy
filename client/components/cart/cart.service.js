'use strict';
import angular from 'angular';

class Item {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  getTotal() {
    return parseFloat(this.quantity * this.price.toFixed(2));
  }
}

export class Cart {
  /*@ngInject*/
  constructor($rootScope, $log, $window, ProductList) {
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.$window = $window;
    this.key = 'cart'; // name of local storage key
    this.ProductList = ProductList;
    this.cartItems = [];
  }

  // Clear the cartItems during checkout()
  clearCartItems() {
    this.$log.info('clearCartItems');
    this.cartItems = []; // Clear the array of Items
    localStorage.removeItem(this.key); // Do I need this (from old empty function)?
    this.$rootScope.$broadcast('Cart:change', {}); // Same for this one
  }

  // Add a product to the cart
  addItem(id, quantity) {
    // Bag quantity and just update based on number of times clicked
    let inCart = this.getItemById(id);
    if(typeof inCart === 'object') { // then increment instead of set the quantity
      //Update quantity of an item if it's already in the cart
      inCart.quantity = quantity;
      this.$rootScope.$broadcast('Cart:itemUpdated', inCart);
    } else {
      let product = this.ProductList.lookup(id);
      let newItem = new Item(id, product.name, product.price, quantity);
      this.cartItems.push(newItem);
      this.$rootScope.$broadcast('Cart:itemAdded', newItem);
    }
    this.$rootScope.$broadcast('Cart:change', {});
    this.$log.info({
      cartItems: this.cartItems,
      total: this.getTotalCost(),
      uniqueItems: this.getTotalUniqueItems(),
      numberOfItems: this.getTotalItems(),
      isEmpty: this.isEmpty()
    });
  }

  checkout() {
    // Iterate through cartItems and get total
    // Use PayPal Payflow Pro to capture transaction
    this.$log.info('Placing order...');

    // Once the order is successfully placed, clear the cart
    this.clearCartItems();
  }

  // Get item by its id
  getItemById(itemId) {
    let foundItem = false;

    angular.forEach(this.cartItems, item => {
      if(item.id === itemId) {
        foundItem = item;
      }
    });
    return foundItem;
  }

  // Sum of quantities in the Cart (not very useful)
  getTotalItems() {
    let count = 0;
    angular.forEach(this.cartItems, item => {
      count += item.quantity;
    });
    return count;
  }

  // Get the unique number of products in the Cart
  getTotalUniqueItems() {
    return this.cartItems.length;
  }

  // Calculate the total cost of all items
  getTotalCost() {
    let total = 0;
    angular.forEach(this.cartItems, item => {
      total += item.getTotal();
    });
    return parseFloat(total).toFixed(2);
  }

  // Remove CartItem by index
  removeItem(index) {
    let item = this.cartItems.splice(index, 1)[0] || {};
    this.$rootScope.$broadcast('Cart:itemRemoved', item);
    this.$rootScope.$broadcast('Cart:change', {});
  }

  // Remove CartItem by id
  removeItemById(id) {
    let removedItem;
    angular.forEach(this.cartItems, (item, index) => {
      if(item.id === id) {
        removedItem = this.cartItems.splice(index, 1)[0] || {};
      }
    });
    this.$rootScope.$broadcast('Cart:itemRemoved', removedItem);
    this.$rootScope.$broadcast('Cart:change', {});
  }

  // Are there any items in Cart? Not used anywhere
  isEmpty() {
    return this.cartItems.length == 0;
  }

  // Load Cart from persistent storage during CartRun
  loadFromStorage() {
    // Check to see if the cart is stored
    let storedCart = false;
    let retrievedValue = this.$window.localStorage[this.key];
    if(retrievedValue) {
      storedCart = JSON.parse(retrievedValue);
    }
    if(angular.isObject(storedCart)) {
      angular.forEach(storedCart.items, item => {
        this.cartItems.push(new Item(item.id, item.name, item.price, item.quantity));
      });
    }
  }

  // Save Cart to persistent storage
  saveToStorage() {
    let valueToStore = JSON.stringify(this.cartItems);
    this.$window.localStorage[this.key] = valueToStore;
  }

}
