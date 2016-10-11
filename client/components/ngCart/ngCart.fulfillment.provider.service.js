'use strict';

/*@ngInject*/
export function NgCartFulfillmentProviderService($injector) {
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
    let provider = $injector.get(`ngCart.fulfillment.${this._obj.service}`);
    return provider.checkout(this._obj.settings);
  };
}
