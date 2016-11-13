'use strict';
import angular from 'angular';

export function FocusMe($timeout, $parse) {
  'ngInject';
  return {
    link: (scope, element, attrs) => {
      let model = $parse(attrs.focusme);
      scope.$watch(model, value => {
        if(value === true) {
          $timeout(() => {
            element[0].focus();
          });
        }
      });
      element.bind('blur', () => {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}

export default angular.module('shyApp.footer', [])
.directive('focusme', FocusMe)
.name;
