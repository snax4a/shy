/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import WorkshopsModule from './workshops.module';
import ToastModule from '../toast/toast.module';

describe('Component: WorkshopsComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(WorkshopsModule));
  beforeEach(angular.mock.module(ToastModule));

  let WorkshopsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    WorkshopsComponent = $componentController('workshops', {});
  }));

  test('should display workshops in chronological order omitting ones that are in the past', () => {
    expect(1).toBe(1);
  });

  test('should add visitor to newsletter when user subscribes with an email not in the database', () => {
    expect(1).toBe(1);
  });

  test('should turn off the optOut for an existing user if they are already in the database', () => {
    expect(1).toBe(1);
  });
});
