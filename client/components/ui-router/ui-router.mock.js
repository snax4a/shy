'use strict';

import angular from 'angular';

angular.module('stateMock', []);
angular.module('stateMock')
  .service('$state', $q => {
    this.expectedTransitions = [];

    this.transitionTo = stateName => {
      if(this.expectedTransitions.length > 0) {
        var expectedState = this.expectedTransitions.shift();
        if(expectedState !== stateName) {
          throw Error(`Expected transition to state: ${expectedState} but transitioned to ${stateName}`);
        }
      } else {
        throw Error(`No more transitions were expected! Tried to transition to ${stateName}`);
      }
      console.log(`Mock transition to: ${stateName}`);
      var deferred = $q.defer();
      var promise = deferred.promise;
      deferred.resolve();
      return promise;
    };

    this.go = this.transitionTo;

    this.expectTransitionTo = stateName => {
      this.expectedTransitions.push(stateName);
    };

    this.ensureAllTransitionsHappened = () => {
      if(this.expectedTransitions.length > 0) {
        throw Error('Not all transitions happened!');
      }
    };
  });
