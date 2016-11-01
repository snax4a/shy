'use strict';
import angular from 'angular';
// Import the factory instead of injecting it into the constructor
import { CartItem } from './cartitem.factory';

export class CartService {
  /*@ngInject*/
  constructor($rootScope, CartStore) {
    console.log('CartService initialized.');
    this.$rootScope = $rootScope;
    this.CartStore = CartStore;
    // BUG: throws error
    // this.CartItem = CartItem;
    this.init();
  }

  init() {
    this.$cart = { // Pseudo-private member
      items: []
    };
  }

  addItem(id, name, price, quantity) {
    let inCart = this.getItemById(id);

    if(typeof inCart === 'object') {
      //Update quantity of an item if it's already in the cart
      inCart.setQuantity(quantity, false);
      this.$rootScope.$broadcast('Cart:itemUpdated', inCart);
    } else {
      // BUG: need to inject CartItemFactory somehow
      let newItem = new CartItem(id, name, price, quantity);
      this.$cart.items.push(newItem);
      this.$rootScope.$broadcast('Cart:itemAdded', newItem);
    }

    this.$rootScope.$broadcast('Cart:change', {});
  }

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

  setCart(cart) {
    this.$cart = cart;
    return this.getCart();
  }

  getCart() {
    return this.$cart;
  }

  getItems() {
    return this.getCart().items;
  }

  getTotalItems() {
    let count = 0;
    let items = this.getItems();
    angular.forEach(items, item => {
      count += item.getQuantity();
    });
    return count;
  }

  getTotalUniqueItems() {
    return this.getCart().items.length;
  }

  totalCost() {
    let total = 0;
    angular.forEach(this.getCart().items, item => {
      total += item.getTotal();
    });
    return +parseFloat(total).toFixed(2);
  }

  removeItem(index) {
    let item = this.$cart.items.splice(index, 1)[0] || {};
    this.$rootScope.$broadcast('Cart:itemRemoved', item);
    this.$rootScope.$broadcast('Cart:change', {});
  }

  removeItemById(id) {
    let item;
    let cart = this.getCart();
    angular.forEach(cart.items, (item, index) => {
      if(item.getId() === id) {
        item = cart.items.splice(index, 1)[0] || {};
      }
    });
    this.setCart(cart);
    this.$rootScope.$broadcast('Cart:itemRemoved', item);
    this.$rootScope.$broadcast('Cart:change', {});
  }

  empty() {
    this.$rootScope.$broadcast('Cart:change', {});
    this.$cart.items = [];
    localStorage.removeItem('cart');
  }

  isEmpty() {
    return this.$cart.items.length > 0;
  }

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

  $restore(storedCart) {
    let that = this;
    that.init();

    angular.forEach(storedCart.items, item => {
      that.$cart.items.push(new CartItem(item._id, item._name, item._price, item._quantity));
    });
    this.$save();
  }

  $save() {
    return this.CartStore.set('cart', JSON.stringify(this.getCart()));
  }
}
