'use strict';
import angular from 'angular';

angular.module('ngCart', ['ngCart.directives'])

  .config([() => {
  }])

  .provider('$ngCart', () => {
    this.$get = () => {};
  })

  .run(['$rootScope', 'ngCart', 'ngCartItem', 'store', ($rootScope, ngCart, ngCartItem, store) => {
    $rootScope.$on('ngCart:change', () => {
      ngCart.$save();
    });

    if(angular.isObject(store.get('cart'))) {
      ngCart.$restore(store.get('cart'));
    } else {
      ngCart.init();
    }
  }])

  .service('ngCart', ['$rootScope', 'ngCartItem', 'store', ($rootScope, ngCartItem, store) => {
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
        var newItem = new ngCartItem(id, name, price, quantity, data);
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

    this.getTax = () => +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);

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
        that.$cart.items.push(new ngCartItem(item._id, item._name, item._price, item._quantity, item._data));
      });
      this.$save();
    };

    this.$save = () => store.set('cart', JSON.stringify(this.getCart()));
  }])

  .factory('ngCartItem', ['$rootScope', '$log', ($rootScope, $log) => {
    var item = (id, name, price, quantity, data) => {
      this.setId(id);
      this.setName(name);
      this.setPrice(price);
      this.setQuantity(quantity);
      this.setData(data);
    };

    item.prototype.setId = id => {
      if(id) this._id = id;
      else {
        $log.error('An ID must be provided');
      }
    };

    item.prototype.getId = () => this._id;

    item.prototype.setName = name => {
      if(name) this._name = name;
      else {
        $log.error('A name must be provided');
      }
    };

    item.prototype.getName = () => this._name;

    item.prototype.setPrice = price => {
      var priceFloat = parseFloat(price);
      if(priceFloat) {
        if(priceFloat <= 0) {
          $log.error('A price must be over 0');
        } else {
          this._price = priceFloat;
        }
      } else {
        $log.error('A price must be provided');
      }
    };

    item.prototype.getPrice = () => this._price;

    item.prototype.setQuantity = (quantity, relative) => {
      var quantityInt = parseInt(quantity, 10);
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
    };

    item.prototype.getQuantity = () => this._quantity;

    item.prototype.setData = data => {
      if(data) this._data = data;
    };

    item.prototype.getData = () => {
      if(this._data) return this._data;
      else $log.info('This item has no data');
    };

    item.prototype.getTotal = () => +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);

    item.prototype.toObject = () => {
      return {
        id: this.getId(),
        name: this.getName(),
        price: this.getPrice(),
        quantity: this.getQuantity(),
        data: this.getData(),
        total: this.getTotal()
      };
    };

    return item;
  }])

  .service('store', ['$window', $window => {
    return {
      get: key => {
        if($window.localStorage[key]) {
          var cart = angular.fromJson($window.localStorage[key]);
          return JSON.parse(cart);
        }
        return false;
      },
      set: (key, val) => {
        if(val === undefined) {
          $window.localStorage.removeItem(key);
        } else {
          $window.localStorage[key] = angular.toJson(val);
        }
        return $window.localStorage[key];
      }
    };
  }])

  .controller('CartController', ['$scope', 'ngCart', ($scope, ngCart) => {
    $scope.ngCart = ngCart;
  }])
  .value('version', '1.0.0');

angular.module('ngCart.directives', ['ngCart.fulfillment'])

  .controller('CartController', ['$scope', 'ngCart', ($scope, ngCart) => {
    $scope.ngCart = ngCart;
  }])

  .directive('ngCartAddtoCart', ['ngCart', ngCart => {
    return {
      restrict: 'E',
      controller: 'CartController',
      scope: {
        id: '@',
        name: '@',
        quantity: '@',
        quantityMax: '@',
        price: '@',
        data: '='
      },
      transclude: true,
      templateUrl: function(element, attrs) {
        if(typeof attrs.templateUrl == 'undefined') {
          return 'template/ngCart/addtocart.html';
        } else {
          return attrs.templateUrl;
        }
      },
      link: (scope, element, attrs) => {
        scope.attrs = attrs;
        scope.inCart = () => ngCart.getItemById(attrs.id);

        if(scope.inCart()) {
          scope.q = ngCart.getItemById(attrs.id).getQuantity();
        } else {
          scope.q = parseInt(scope.quantity, 10);
        }

        scope.qtyOpt = [];
        for(var i = 1; i <= scope.quantityMax; i++) {
          scope.qtyOpt.push(i);
        }
      }
    };
  }])

  .directive('ngCartCart', [() => {
    return {
      restrict: 'E',
      controller: 'CartController',
      scope: {},
      templateUrl: function(element, attrs) {
        if(typeof attrs.templateUrl == 'undefined') {
          return 'template/ngCart/cart.html';
        } else {
          return attrs.templateUrl;
        }
      },
      link: (scope, element, attrs) => {}
    };
  }])

    .directive('ngCartSummary', [() => {
      return {
        restrict: 'E',
        controller: 'CartController',
        scope: {},
        transclude: true,
        templateUrl: function(element, attrs) {
          if(typeof attrs.templateUrl == 'undefined') {
            return 'template/ngCart/summary.html';
          } else {
            return attrs.templateUrl;
          }
        }
      };
    }])

    .directive('ngCartCheckout', [() => {
      return {
        restrict: 'E',
        controller: ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfillmentProvider', ($rootScope, $scope, ngCart, fulfillmentProvider) => {
          $scope.ngCart = ngCart;

          $scope.checkout = () => {
            fulfillmentProvider.setService($scope.service);
            fulfillmentProvider.setSettings($scope.settings);
            fulfillmentProvider.checkout()
              .success((data, status, headers, config) => {
                $rootScope.$broadcast('ngCart:checkout_succeeded', data);
              })
              .error((data, status, headers, config) => {
                $rootScope.$broadcast('ngCart:checkout_failed', {
                  statusCode: status,
                  error: data
                });
              });
          };
        }]),
        scope: {
          service: '@',
          settings: '='
        },
        transclude: true,
        templateUrl: (element, attrs) => {
          if(typeof attrs.templateUrl == 'undefined') {
            return 'template/ngCart/checkout.html';
          } else {
            return attrs.templateUrl;
          }
        }
      };
    }]);

angular.module('ngCart.fulfillment', [])
  .service('fulfillmentProvider', ['$injector', $injector => {
    this._obj = {
      service: undefined,
      settings: undefined
    };

    this.setService = service => {
      this._obj.service = service;
    };

    this.setSettings = settings => {
      this._obj.settings = settings;
    };

    this.checkout = () => {
      var provider = $injector.get('ngCart.fulfillment.' + this._obj.service);
      return provider.checkout(this._obj.settings);
    };
  }])

  .service('ngCart.fulfillment.log', ['$q', '$log', 'ngCart', ($q, $log, ngCart) => {
    this.checkout = () => {
      var deferred = $q.defer();

      $log.info(ngCart.toObject());
      deferred.resolve({
        cart: ngCart.toObject()
      });

      return deferred.promise;
    };
  }])

  .service('ngCart.fulfillment.http', ['$http', 'ngCart', ($http, ngCart) => {
    this.checkout = settings => $http.post(settings.url, {data: ngCart.toObject(), options: settings.options});
  }])

  .service('ngCart.fulfillment.paypal', ['$http', 'ngCart', ($http, ngCart) => {
  }]);
