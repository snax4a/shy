'use strict';
import angular from 'angular';

export function IntegerOnly() {
  'ngInject';
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      element.on('keypress', event => {
        let typedCharacter = String.fromCharCode(event.keyCode);
        console.log(typedCharacter);
        console.log(attrs);
        console.log(event);
        let isInteger = /[0-9]|-/.test(typedCharacter);
        if(!isInteger) event.preventDefault();
      });
    }
  };
}

export default angular.module('shyApp.integeronly', [])
  .directive('integeronly', IntegerOnly)
  .name;
