import angular from 'angular';

// Assumes Twitter's load script is in _index.html
export default angular.module('shyApp.tweet', [])
  .component('tweet', {
    template: '<a class="twitter-share-button" data-text="Join me for {{ $ctrl.text }}" data-url="{{ $ctrl.url }}" data-size="large" href="https://twitter.com/intent/tweet" style="width:78px; height:26px;">Tweet</a>',
    bindings: {
      url: '@',
      text: '@'
    }
  })
  .name;
