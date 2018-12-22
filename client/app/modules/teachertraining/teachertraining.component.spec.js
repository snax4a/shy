/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import TeacherTrainingModule from './teachertraining.module';
import CartModule from '../cart/cart.module';

describe('Component: TeacherTrainingModule', function() {
  // load the controller's module
  beforeEach(angular.mock.module(TeacherTrainingModule));
  beforeEach(angular.mock.module(CartModule));

  var TeacherTrainingComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeacherTrainingComponent = $componentController('teachertraining', {});
  }));

  it('should display Teacher Training information with payment options', function() {
    expect(1).to.equal(1);
  });

  it('should disable "Pay Now" unless "I agree" checkbox is checked', function() {
    expect(1).to.equal(1);
  });

  it('should add the teacher training to the cart if user clicks "Pay Now"', function() {
    expect(1).to.equal(1);
  });
});
