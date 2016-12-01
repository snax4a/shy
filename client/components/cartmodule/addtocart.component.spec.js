'use strict';
import angular from 'angular';
import addToCart from './addtocart.component';

describe('Component: addtocart', function() {
  // load the component's module
  //beforeEach(module('shyApp.addtocart'));
  beforeEach(angular.mock.module(addToCart));

  var addtocartComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    addtocartComponent = $componentController('addtocart', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
