module.exports = function () {
  'use strict';

  // We need to make sure that the list pages are rendered after the content pages otherwise the intro
  // filter will fail. Hacky workaround?
  return function (pages, next, options) {
    var sortedPages = pages.sort(function(p1, p2) {
      var t1 = p1.template;
      var t2 = p2.template;
      if (t1 === t2) {
        return 0;
      }
      if (t1 === 'home.html' || t1 === 'feed.xml' || t1 === 'tag-page.xml') {
        return 1;
      }
      if (t2 === 'home.html' || t1 === 'feed.xml' || t1 === 'tag-page.xml') {
        return 1;
      }
      return 0;
    });
    next(sortedPages);
  }
};