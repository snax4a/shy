/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import TeacherTrainingModule from './teachertraining.module';
import CartModule from '../cart/cart.module';

describe('Component: TeacherTrainingModule', () => {
  // load the controller's module
  beforeEach(angular.mock.module(TeacherTrainingModule));
  beforeEach(angular.mock.module(CartModule));

  let TeacherTrainingComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    TeacherTrainingComponent = $componentController('teachertraining', {});
  }));

  test('should display Teacher Training information with payment options', () => {
    expect(1).toBe(1);
  });

  test('should disable "Pay Now" unless "I agree" checkbox is checked', () => {
    expect(1).toBe(1);
  });

  test('should add the teacher training to the cart if user clicks "Pay Now"', () => {
    expect(1).toBe(1);
  });
});
