module.exports = function () {
  'use strict';

  // We need to make sure that the list pages are rendered after the content pages otherwise the intro
  // filter will fail. Hacky workaround?
  return function (pages, next, options) {
    var sortedPages = pages.sort(function(p1, p2) {
      var o1 = p1.renderOrder || 0;
      var o2 = p2.renderOrder || 0;
      return o1 - o2;
    });
    next(sortedPages);
  }
};