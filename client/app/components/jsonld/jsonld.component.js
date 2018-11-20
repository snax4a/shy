import angular from 'angular';

export class JsonldComponent {
  $onChanges() {
    this.json = JSON.stringify(this.data);
  }
}

export default angular.module('shyApp.jsonld', [])
  .component('jsonld', {
    controller: JsonldComponent,
    bindings: { data: '<' },
    template: '<script type="application/ld+json" ng-bind="$ctrl.json"></script>'
  })
  .name;
