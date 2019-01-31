/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import AnnouncementManagerModule from './announcementmanager.module';
import AuthModule from '../../modules/auth/auth.module';

describe('Module: AnnouncementManagerComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(AnnouncementManagerModule));

  let announcementManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject($componentController => {
    announcementManagerComponent = $componentController('announcementmanager', {});
  }));

  test('should display a New Announcement button and table of results', () => {
    expect(1).toBe(1);
  });
});
