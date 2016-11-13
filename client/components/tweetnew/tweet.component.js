'use strict';
import angular from 'angular';

// Twitter's load script
window.twttr = (function(d, s, id) {
  let js;
  let fjs = d.getElementsByTagName(s)[0];
  let t = window.twttr || {};
  if(d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = '//platform.twitter.com/widgets.js';
  fjs.parentNode.insertBefore(js, fjs);
  t._e = [];
  t.ready = f => {
    t._e.push(f);
  };
  return t;
}(document, 'script', 'twitter-wjs'));

export default angular.module('shyApp.tweet', [])
  .component('tweet', {
    template: '<a class="twitter-share-button" data-text="Join me for {{ $ctrl.text }}" data-url="{{ $ctrl.url }}" href="https://twitter.com/intent/tweet">Tweet</a>',
    bindings: {
      url: '@',
      text: '@'
    }
  })
  .name;
