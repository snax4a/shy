'use strict';
import angular from 'angular';
import classesPage from './classes.component';

describe('Component: ClassesComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(classesPage));

  let ClassesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    ClassesComponent = $componentController('classes', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
