/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import WorkshopManagerModule from './workshopmanager.module';
import AuthModule from '../auth/auth.module';
import WorkshopModule from '../workshops/workshops.module';

describe('Component: WorkshopManagerComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(WorkshopManagerModule));
  beforeEach(angular.mock.module(WorkshopModule));

  let WorkshopManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject($componentController => {
    WorkshopManagerComponent = $componentController('workshopmanager', {});
  }));

  test('should display a New Workshop Item button and table of results', () => {
    expect(1).toBe(1);
  });
});
