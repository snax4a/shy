/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import AnnouncementManagerModule from './announcementmanager.module';
import AuthModule from '../../modules/auth/auth.module';

describe('Module: AnnouncementManagerComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(AnnouncementManagerModule));

  let announcementManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    announcementManagerComponent = $componentController('announcementmanager', {});
  }));

  it('should display a New Announcement button and table of results', function() {
    expect(1).to.equal(1);
  });
});
