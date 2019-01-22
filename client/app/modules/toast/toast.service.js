// ES6 Port of https://github.com/sibiraj-s/angularjs-toast#readme

import angular from 'angular';

export function ToastService($rootScope, $http, $templateCache, $compile, $timeout) {
  'ngInject';
  const html = `
    <div class="angularjs-toast" ng-class="$toastPlace ? 'position-fixed' : 'position-relative'">
      <ul class="toast-container" ng-class="[$position, $masterClass]">
        <li class="animate-repeat" ng-repeat="data in $toastMessages track by data.id">
          <div class="alert alert-dismissible" ng-class="::$toastClass">
            <span ng-bind-html="data.message"></span>
            <a href="javascript:void(0)" class="close" data-dismiss="alert" aria-label="close" title="close" ng-click="$close($index)" ng-if="$dismissible">×</a>
          </div>
        </li>
      </ul>
    </div>`;
  let templateBase = 'angularjs-toast.html'; // template
  $templateCache.put(templateBase, html); // put html into template cache

  // Defaults
  const container = document.querySelector('body');
  const duration = 5000;
  const dismissible = true;
  const emptyMessage = 'Hi there!';
  const maxToast = 6;
  const position = 'right';
  const toastClass = 'alert-success';

  // Scope defaults
  const scope = $rootScope.$new();
  scope.$toastMessages = [];

  // toast function
  return args => {
    // User parameters
    args.duration = args.duration ? args.duration : duration;
    args.maxToast = args.maxToast ? args.maxToast : maxToast;
    args.insertFromTop = args.insertFromTop ? args.insertFromTop : false;
    args.removeFromTop = args.removeFromTop ? args.removeFromTop : false;
    args.container = args.container ? document.querySelector(args.container) : container;

    // values that bind to HTML
    scope.$position = args.position ? args.position : position;
    scope.$toastPlace = args.container === container;
    scope.$masterClass = args.masterClass ? args.masterClass : '';
    scope.$toastClass = args.className ? args.className : toastClass;
    scope.$dismissible = args.dismissible ? args.dismissible : dismissible;
    scope.$message = args.message ? args.message : emptyMessage;

    // check if templates are present in the body / append
    const htmlTemplate = angular.element(document.getElementsByClassName('angularjs-toast'));
    if(!htmlTemplate[0]) {
      // if the element not appended to html,
      // get default template from ->templateBase
      // append to ->args.container
      $http.get(templateBase, {
        cache: $templateCache
      }).then(function(response) {
        var templateElement;
        // compile the element
        // append default template to the ->templateBase
        templateElement = $compile(response.data)(scope);
        angular.element(args.container).append(templateElement);
      });
    }

    // remove element besed on time interval ->args.duration
    const timeout = element => {
      $timeout(() => {
        let index;
        index = scope.$toastMessages.indexOf(element);
        if(index !== -1) {
          scope.$toastMessages.splice(index, 1);
        }
      }, args.duration);
    };

    // append inputs to json variable to push to the ->scope.$toastMessages array
    const json = {
      message: args.message,
      id: new Date().getUTCMilliseconds()
    };

    // push elements to array
    const pushToArray = () => {
      if(args.insertFromTop) {
        scope.$toastMessages.unshift(json);
      } else {
        scope.$toastMessages.push(json);
      }
      timeout(json);
    };

    // remove last/ first element from ->scope.$toastMessages when the maxlength is reached
    // default maxlength is 6
    if(scope.$toastMessages.length === args.maxToast) {
      if(args.removeFromTop) {
        scope.$toastMessages.shift();
      } else {
        scope.$toastMessages.pop();
      }
      pushToArray();
    } else {
      pushToArray();
    }

    // close selected element
    // remove ->$index element from ->scope.toastMessages
    scope.$close = index => {
      scope.$toastMessages.splice(index, 1);
    };
  };
}
