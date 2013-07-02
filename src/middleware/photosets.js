
var grunt = require('grunt');
var async = require('async');
var Page = require('grunt-haggerston/tasks/lib/page');

module.exports = function() {
  'use strict';

  return function (pages, next, options) {
    var photosets = grunt.file.readJSON('src/data/photos/photosets.json');
    async.each(photosets, function(photoset, cb) {
        var photosetData = grunt.file.readJSON('src/data/photos/' + photoset.id + '.json');
        var page = new Page('photos/' + photoset.id + '/index.html', {
          template: 'photoset.html',
          templateData: photosetData
        });
        pages.push(page);
        cb();
      }, function(err) {
        next(pages);
      });
  }
};