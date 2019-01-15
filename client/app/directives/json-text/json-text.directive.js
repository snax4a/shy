import angular from 'angular';

export function jsonText() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: (scope, element, attributes, ngModel) => {
      function into(input) {
        return JSON.parse(input);
      }
      function out(data) {
        return JSON.stringify(data);
      }
      ngModel.$parsers.push(into);
      ngModel.$formatters.push(out);
    }
  };
}

export default angular.module('shyApp.jsonText', [])
  .directive('jsonText', jsonText)
  .name;
