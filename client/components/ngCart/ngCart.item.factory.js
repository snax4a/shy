'use strict';

/*@ngInject*/
export function NgCartItemFactory($rootScope, $log) {
  return class NgCartItem {
    constructor(id, name, price, quantity, data) {
      this.setId(id);
      this.setName(name);
      this.setPrice(price);
      this.setQuantity(quantity);
      this.setData(data);
    }

    setId(id) {
      if(id) this._id = id;
      else {
        $log.error('An ID must be provided');
      }
    }

    getId() {
      return this._id;
    }

    setName(name) {
      if(name) this._name = name;
      else {
        $log.error('A name must be provided');
      }
    }

    getName() {
      return this._name;
    }

    setPrice(price) {
      const priceFloat = parseFloat(price);
      if(priceFloat) {
        if(priceFloat <= 0) {
          $log.error('A price must be over 0');
        } else {
          this._price = priceFloat;
        }
      } else {
        $log.error('A price must be provided');
      }
    }

    getPrice() {
      return this._price;
    }

    setQuantity(quantity, relative) {
      const quantityInt = parseInt(quantity, 10);
      if(quantityInt % 1 === 0) {
        if(relative === true) {
          this._quantity += quantityInt;
        } else {
          this._quantity = quantityInt;
        }
        if(this._quantity < 1) this._quantity = 1;
      } else {
        this._quantity = 1;
        $log.info('Quantity must be an integer and was defaulted to 1');
      }
    }

    getQuantity() {
      return this._quantity;
    }

    setData(data) {
      if(data) this._data = data;
    }

    getData() {
      if(this._data) return this._data;
      else $log.info('This item has no data');
    }

    getTotal() {
      return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
    }

    toObject() {
      return {
        id: this.getId(),
        name: this.getName(),
        price: this.getPrice(),
        quantity: this.getQuantity(),
        data: this.getData(),
        total: this.getTotal()
      };
    }
  };
}
