'use strict';
import angular from 'angular';

export default class Cart {
  /*@ngInject*/
  constructor($log) {
    this.$log = $log;
    this.$log.info('Cart constructor');
    this._items = this._loadItems();
    // Does this get called once for each use or is it only once because it's a singleton?
  }

  _loadItems() {
    // load quantity and id from cookie or persistent storage
  }

  _storeItems() {
    // store quantity and id pairs
  }

  _clearItems() {
    // After placeOrder(), make sure the list is cleared
  }

  _findItemByID() {
    // Used by addItem and removeItem
  }

  addItem(id) {
    this.$log.info(`addItem(${id})`);
    // Is that product id already in Cart?
    //  If no, lookup name and price
    //  If yes, increment the count by one
    this._storeItems();
  }

  removeItem(id) {
    this.$log.info(`removeItem(${id})`);
    // Is that product id in Cart?
    // If no, ignore
    this._storeItems();
  }

  placeOrder() {
    // Iterate through cart and get total
    // Use PayPal Payflow Pro to capture transaction
    this._clearItems();
  }
}
