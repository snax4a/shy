/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import profile from './profile.component';
import AuthModule from '../../components/auth/auth.module';

describe('Component: ProfileComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(profile));

  let profileComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    profileComponent = $componentController('profile', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
