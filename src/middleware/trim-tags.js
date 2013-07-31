module.exports = function () {
  'use strict';

  // We only want tags to show (and to generate tag pages) where there are at least two items on the
  // generated page. Otherwise they are just dead-end links...
  return function trimTags(pages, next, options) {
    var tagCounts = {};
    pages.forEach(function(page) {
      var tags = page.templateData.tags || [];
      tags.forEach(function(tag) {
        if (!tagCounts[tag]) {
          tagCounts[tag] = 0;
        }
        tagCounts[tag] ++;
      });
    });
    pages.forEach(function(page) {
      var tags = page.templateData.tags || [];
      var cleanedTags = [];
      tags.forEach(function(tag) {
        if (tagCounts[tag] > 1) {
          cleanedTags.push(tag);
        }
      });
      page.templateData.tags = cleanedTags.sort();
    });
    next(pages);
  }
};