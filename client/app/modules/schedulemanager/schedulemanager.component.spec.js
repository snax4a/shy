/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import ScheduleManagerModule from './schedulemanager.module';
import AuthModule from '../../modules/auth/auth.module';
import ClassesModule from '../../modules/classes/classes.module';

describe('Component: ScheduleManagerComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(ScheduleManagerModule));
  beforeEach(angular.mock.module(ClassesModule));

  let ScheduleManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject($componentController => {
    ScheduleManagerComponent = $componentController('schedulemanager', {});
  }));

  test('should display a New Schedule Item button and table of results', () => {
    expect(1).toBe(1);
  });
});
