import angular from 'angular';

export function compareTo() {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '=compareTo'
    },
    link: (scope, element, attributes, ngModel) => {
      ngModel.$validators.compareTo = modelValue => modelValue == scope.otherModelValue;

      scope.$watch('otherModelValue', () => {
        ngModel.$validate();
      });
    }
  };
}

export default angular.module('shyApp.compareTo', [])
  .directive('compareTo', compareTo)
  .name;
