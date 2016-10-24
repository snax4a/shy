'use strict';

/*@ngInject*/
export class CartFulfillmentProviderService {
  constructor($injector) {
    this.$injector = $injector;
    this._obj = {
      service: undefined,
      settings: undefined
    };
  }

  setService(service) {
    this._obj.service = service;
  }

  setSettings(settings) {
    this._obj.settings = settings;
  }

  checkout() {
    console.log(`_obj.service = ${this._obj.service}`);
    let provider = this.$injector.get(this._obj.service);
    return provider.checkout(this._obj.settings);
  }
}
