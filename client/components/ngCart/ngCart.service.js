'use strict';
import angular from 'angular';

/*@ngInject*/
export function NgCartService($rootScope, NgCartItemFactory, NgCartStoreService) {
  // Replace with a class and constructor
  this.init = () => {
    this.$cart = {
      shipping: null,
      taxRate: null,
      tax: null,
      items: []
    };
  };

  this.addItem = (id, name, price, quantity, data) => {
    var inCart = this.getItemById(id);

    if(typeof inCart === 'object') {
      //Update quantity of an item if it's already in the cart
      inCart.setQuantity(quantity, false);
      $rootScope.$broadcast('ngCart:itemUpdated', inCart);
    } else {
      var newItem = new NgCartItemFactory(id, name, price, quantity, data);
      this.$cart.items.push(newItem);
      $rootScope.$broadcast('ngCart:itemAdded', newItem);
    }

    $rootScope.$broadcast('ngCart:change', {});
  };

  this.getItemById = itemId => {
    var items = this.getCart().items;
    var build = false;

    angular.forEach(items, item => {
      if(item.getId() === itemId) {
        build = item;
      }
    });
    return build;
  };

  this.setShipping = shipping => {
    this.$cart.shipping = shipping;
    return this.getShipping();
  };

  this.getShipping = () => {
    if(this.getCart().items.length == 0) return 0;
    return this.getCart().shipping;
  };

  this.setTaxRate = taxRate => {
    this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
    return this.getTaxRate();
  };

  this.getTaxRate = () => this.$cart.taxRate;

  this.getTax = () => +parseFloat(this.getSubTotal() / 100 * this.getCart().taxRate).toFixed(2);

  this.setCart = cart => {
    this.$cart = cart;
    return this.getCart();
  };

  this.getCart = () => this.$cart;

  this.getItems = () => this.getCart().items;

  this.getTotalItems = () => {
    var count = 0;
    var items = this.getItems();
    angular.forEach(items, item => {
      count += item.getQuantity();
    });
    return count;
  };

  this.getTotalUniqueItems = () => this.getCart().items.length;

  this.getSubTotal = () => {
    var total = 0;
    angular.forEach(this.getCart().items, item => {
      total += item.getTotal();
    });
    return +parseFloat(total).toFixed(2);
  };

  this.totalCost = () => +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);

  this.removeItem = index => {
    var item = this.$cart.items.splice(index, 1)[0] || {};
    $rootScope.$broadcast('ngCart:itemRemoved', item);
    $rootScope.$broadcast('ngCart:change', {});
  };

  this.removeItemById = id => {
    var item;
    var cart = this.getCart();
    angular.forEach(cart.items, (item, index) => {
      if(item.getId() === id) {
        item = cart.items.splice(index, 1)[0] || {};
      }
    });
    this.setCart(cart);
    $rootScope.$broadcast('ngCart:itemRemoved', item);
    $rootScope.$broadcast('ngCart:change', {});
  };

  this.empty = () => {
    $rootScope.$broadcast('ngCart:change', {});
    this.$cart.items = [];
    localStorage.removeItem('cart');
  };

  this.isEmpty = () => this.$cart.items.length > 0;

  this.toObject = () => {
    if(this.getItems().length === 0) return false;

    var items = [];
    angular.forEach(this.getItems(), item => {
      items.push(item.toObject());
    });

    return {
      shipping: this.getShipping(),
      tax: this.getTax(),
      taxRate: this.getTaxRate(),
      subTotal: this.getSubTotal(),
      totalCost: this.totalCost(),
      items
    };
  };

  this.$restore = storedCart => {
    var that = this;
    that.init();
    that.$cart.shipping = storedCart.shipping;
    that.$cart.tax = storedCart.tax;

    angular.forEach(storedCart.items, item => {
      that.$cart.items.push(new NgCartItemFactory(item._id, item._name, item._price, item._quantity, item._data));
    });
    this.$save();
  };

  this.$save = () => NgCartStoreService.set('cart', JSON.stringify(this.getCart()));
}
