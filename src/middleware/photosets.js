var grunt = require('grunt');
var async = require('async');
var Page = require('grunt-haggerston/tasks/lib/page');

module.exports = function () {
  'use strict';

  return function (pages, next, options) {
    var photosets = grunt.file.readJSON('src/data/photos/photosets.json');
    async.each(photosets, function (photoset, cb) {
      var photosetData = grunt.file.readJSON('src/data/photos/' + photoset.id + '.json');
      var lastPhoto = photosetData.photos[photosetData.photos.length - 1];
      photosetData.date = lastPhoto.datetaken; // TODO: Don't presume the last in the set is the oldest?
      var averageLocationData = photosetData.photos.reduce(function(memo, photo) {
        if (photo.geo_is_public) {
          memo.num ++;
          memo.latitude += photo.latitude;
          memo.longitude += photo.longitude;
        }
        return memo;
      }, {num: 0, latitude: 0, longitude: 0});
      if (averageLocationData.num > 0) {
        photosetData.latitude = averageLocationData.latitude / averageLocationData.num;
        photosetData.longitude = averageLocationData.longitude / averageLocationData.num;
      }
      var page = new Page('/photos/' + photoset.id + '/index.html', {
        template: 'photoset.html',
        templateData: photosetData
      });
      pages.push(page);
      cb();
    }, function (err) {
      next(pages);
    });
  }
};