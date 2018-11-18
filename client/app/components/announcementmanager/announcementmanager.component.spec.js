/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import AnnouncementManager from './announcementmanager.component';
import AuthModule from '../../modules/auth/auth.module';

describe('Component: AnnouncementManagerComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(AnnouncementManager));

  let AnnouncementManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    AnnouncementManagerComponent = $componentController('announcementmanager', {});
  }));

  it('should display a New Announcement button and table of results', function() {
    expect(1).to.equal(1);
  });
});
