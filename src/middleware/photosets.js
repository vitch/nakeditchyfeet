var grunt = require('grunt');
var async = require('async');
var Page = require('grunt-haggerston/tasks/lib/page');

module.exports = function () {
  'use strict';

  return function photosets(pages, next, options) {
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
      photosetData.author = 'Kelvin Luck';
      photosetData.tags = ['photo'];
      var page = new Page('/photos/' + photoset.id + '/index.html', {
        template: 'photoset.html',
        templateData: photosetData
      });
      pages.push(page);
      photosetData.photos.forEach(function(photo, i) {
        var hasLarger = !!photo.url_c;
        var photoPage = new Page('/photos/' + photoset.id + '/' + photo.id + '.html', {
          template: 'photo.html',
          templateData: {
            title: photoset.title + ': ' + photo.title,
            photoset: photosetData,
            photoUrl: hasLarger ? photo.url_c : photo.url_z,
            photoId: photo.id,
            photoCss: 'width: ' + photo['width_' + (hasLarger ? 'c' : 'z')] + 'px; max-height:' + photo['height_' + (hasLarger ? 'c' : 'z')] + 'px',
            previousPhotoLink: i == 0 ? false : photosetData.photos[i-1].id + '.html',
            nextPhotoLink: i == photosetData.photos.length - 1 ? false : photosetData.photos[i+1].id + '.html'
          }
        });
        pages.push(photoPage);

        // Set up photo variables so we can display the one which is tall enough on the photoset pages...
        var photoSize = 'l';
        ['s', 'n', 'm', 'z', 'c'].some(function(size, i) {
          if (photo['height_' + size] > 130) {
            photoSize = size;
            return true;
          }
        });
        photo.listPageUrl = photo['url_' + photoSize];
        photo.listPageHeight = photo['height_' + photoSize];
        photo.listPageWidth = photo['width_' + photoSize];
      });
      cb();
    }, function (err) {
      next(pages);
    });
  }
};