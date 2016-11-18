'use strict';

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
  constructor($log, $window, $location, $http, ProductList) {
    this.$log = $log;
    this.$window = $window;
    this.$location = $location;
    this.$http = $http;
    this.key = 'cart'; // name of local storage key
    this.ProductList = ProductList;
    this.cartItems = [];
    this.paymentInfo = {
      ccNumber: '3839476385937493'
    };
    this.purchaser = {};
    this.recipient = {};
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

  // Iterate through cartItems and get total
  // Use PayPal Payflow Pro (or Braintree) to capture transaction
  // In the CartController, we'll need to unhide the order confirmation (if successful)
  placeOrder() {
    this.$log.info('Placing order...');
    // Maybe trim what I'm sending (instead of whole Cart)
    this.$http.post('/api/order/place', this)
      .success(data => {
        // Stay in this location and display the Order confirmation
        this.$log.info(data);
      })
      .error(err => {
        this.$log.error('Order failed', err);
        err = err.data;
        // Instead, pass the error back to the page Controller to display
        for(let error of err.errors) {
          this.$log.info(error);
        }
      });
    // Once the order is successfully placed, clear the cart
    this.clearCartItems();
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
