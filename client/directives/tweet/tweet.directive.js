'use strict';
import angular from 'angular';
import debounce from 'es6-promise-debounce';

// Loads Twitter's script to body
window.twttr = (function(d, s, id) {
  var js;
  var fjs = d.getElementsByTagName(s)[0];
  var t = window.twttr || {};
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

/*@ngInject*/
export function Tweet($timeout) {
  return {
    link: (scope, element, attr) => {
      var renderTwitterButton = debounce(() => {
        if(attr.url) {
          $timeout(() => {
            element[0].innerHTML = '';
            window.twttr.widgets.createShareButton(
              attr.url,
              element[0],
              () => {}, {
                count: attr.count,
                text: attr.text,
                via: attr.via,
                size: attr.size
              }
            );
          });
        }
      }, 75);
      attr.$observe('url', renderTwitterButton);
      attr.$observe('text', renderTwitterButton);
    }
  };
}

export default angular.module('shyApp.tweet', [])
  .directive('tweet', Tweet)
  .name;
