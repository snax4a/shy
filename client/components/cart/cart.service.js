'use strict';
import angular from 'angular';

export class Cart {
  /*@ngInject*/
  constructor($rootScope, $log, CartStore, CartItem, ProductList) {
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.CartStore = CartStore;
    this.CartItem = CartItem;
    this.ProductList = ProductList;
  }

  // Clear the CartItems
  init() {
    this.$cart = { // Pseudo-private member
      items: []
    };
  }

  // Add a CartItem
  // This is where we need to trim out the name and price that should come
  // from products.json
  addItem(id, quantity) {
    // Bag quantity and just update based on number of times clicked
    let inCart = this.getItemById(id);
    let CartItem = this.CartItem;

    if(typeof inCart === 'object') {
      //Update quantity of an item if it's already in the cart
      inCart.setQuantity(quantity, false);
      this.$rootScope.$broadcast('Cart:itemUpdated', inCart);
    } else {
      let product = this.ProductList.lookup(id);
      let newItem = new CartItem(id, product.name, product.price, quantity);
      this.$cart.items.push(newItem);
      this.$rootScope.$broadcast('Cart:itemAdded', newItem);
    }
    this.$rootScope.$broadcast('Cart:change', {});
    this.$log.info(this.$cart);
  }

  // Get item by its id
  getItemById(itemId) {
    let items = this.getCart().items;
    let foundItem = false;

    angular.forEach(items, item => {
      if(item.getId() === itemId) {
        foundItem = item;
      }
    });
    return foundItem;
  }

  // Set the $cart object
  setCart(cart) {
    this.$cart = cart;
    return this.getCart();
  }

  // Get the $cart object
  getCart() {
    return this.$cart;
  }

  // Get just the array of items from $cart object
  getItems() {
    return this.getCart().items;
  }

  // Sum of quantities in the Cart (not very useful)
  getTotalItems() {
    let count = 0;
    let items = this.getItems();
    angular.forEach(items, item => {
      count += item.getQuantity();
    });
    return count;
  }

  // Get the unique number of products in the Cart
  getTotalUniqueItems() {
    return this.getCart().items.length;
  }

  // Calculate the total cost of all items
  totalCost() {
    let total = 0;
    angular.forEach(this.getCart().items, item => {
      total += item.getTotal();
    });
    return +parseFloat(total).toFixed(2);
  }

  // Remove CartItem by index
  removeItem(index) {
    let item = this.$cart.items.splice(index, 1)[0] || {};
    this.$rootScope.$broadcast('Cart:itemRemoved', item);
    this.$rootScope.$broadcast('Cart:change', {});
  }

  // Remove CartItem by id
  removeItemById(id) {
    let removedItem;
    let cart = this.getCart();
    angular.forEach(cart.items, (item, index) => {
      if(item.getId() === id) {
        removedItem = cart.items.splice(index, 1)[0] || {};
      }
    });
    this.setCart(cart);
    this.$rootScope.$broadcast('Cart:itemRemoved', removedItem);
    this.$rootScope.$broadcast('Cart:change', {});
  }

  // Clear the items in the cart
  empty() {
    this.$rootScope.$broadcast('Cart:change', {});
    this.$cart.items = [];
    localStorage.removeItem('cart');
  }

  // Are there any items in Cart?
  isEmpty() {
    return this.$cart.items.length > 0;
  }

  // Return a simple object with the totalCost and array of items
  toObject() {
    if(this.getItems().length === 0) return false;

    let items = [];
    angular.forEach(this.getItems(), item => {
      items.push(item.toObject());
    });

    return {
      totalCost: this.totalCost(),
      items
    };
  }

  // Read Cart from persistent storage
  $restore(storedCart) {
    this.$log.info('Restored cart');
    let that = this;
    that.init();
    let CartItem = that.CartItem;

    angular.forEach(storedCart.items, item => {
      that.$cart.items.push(new CartItem(item._id, item._name, item._price, item._quantity));
    });
    this.$save();
  }

  // Write Cart to persistent storage
  $save() {
    return this.CartStore.set('cart', JSON.stringify(this.getCart()));
  }

}
