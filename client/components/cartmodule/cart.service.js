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
  constructor($log, $window, ProductList) {
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
  getItemById(id) {
    let foundItem = false;

    angular.forEach(this.cartItems, item => {
      if(item.id == id) {
        foundItem = item;
      }
    });
    return foundItem;
  }

  // Sum of quantities in the Cart, not used yet
  getTotalItems() {
    let count = 0;
    angular.forEach(this.cartItems, item => {
      count += item.quantity;
    });
    return count;
  }

  // Get the unique number of products in the Cart, not used yet
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
    this.cartItems.splice(index, 1);
    this.saveToStorage();
  }

  // Remove CartItem by id
  removeItemById(id) {
    angular.forEach(this.cartItems, (item, index) => {
      if(item.id === id) {
        this.cartItems.splice(index, 1);
      }
    });
    this.saveToStorage();
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
