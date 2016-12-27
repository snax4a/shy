'use strict';
import angular from 'angular';
import main from './main.component';

describe('Component: MainComponent', () => {
  beforeEach(angular.mock.module(main));

  let mainComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    mainComponent = $componentController('main', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
