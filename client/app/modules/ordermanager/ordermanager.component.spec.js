/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import OrderManagerModule from './ordermanager.module';
import AuthModule from '../auth/auth.module';

describe('Component: OrderManagerComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(OrderManagerModule));

  let OrderManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject($componentController => {
    OrderManagerComponent = $componentController('ordermanager', {});
  }));

  test('should display a search field', () => {
    expect(1).toBe(1);
  });
});
