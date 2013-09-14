var async = require('async');

module.exports = function(grunt) {

  grunt.registerTask('flickr', function() {
    var done = this.async();

    var options = this.options();

    var Flickr = require('flickr').Flickr;
    var client = new Flickr(options.apiKey, options.apiSecret);

    grunt.verbose.write('Downloading photosets data...');
    client.executeAPIRequest('flickr.collections.getTree', {
        user_id: options.userId,
        collection_id: options.collectionId
      }, false, function(error, response) {
        var sets = response.collections.collection[0].set;
        grunt.verbose.ok();
        grunt.file.write('src/data/photos/photosets.json', JSON.stringify(sets, null, 2));
        async.each(sets, function(set, cb) {
          if (grunt.file.exists('src/data/photos/' + set.id + '.json')) {
            cb();
          } else {
            grunt.verbose.writeln('Downloading info for set ' + set.id + ' ("' + set.title + ')"...');
            client.executeAPIRequest('flickr.photosets.getPhotos', {
              photoset_id: set.id,
              extras: 'description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o'
            }, false, function(error, setResponse) {
              var photoset = {
                id: set.id,
                title: set.title,
                description: set.description,
                photos: setResponse.photoset.photo
              };
              grunt.file.write('src/data/photos/' + set.id + '.json', JSON.stringify(photoset, null, 2));
              cb();
            });
          }
        }, function(err) {
          done();
        });

      });
  });

}