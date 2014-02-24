var _ = require('underscore');

module.exports = function(grunt) {

  grunt.registerTask('stays', function() {

    var options = this.options();
    grunt.log.write('Converting stays data...');

    var stays = grunt.file.readJSON(options.src);
    var locations = {};
    _.each(stays.locations, function(location) {
      location.dates = [];
      locations[location.id] = location;
      delete location.id;
    });

    _.each(stays.stays, function(stay) {
      locations[stay.location].dates.push(stay.date);
    });


    grunt.file.write(options.out, JSON.stringify(_.toArray(_.reject(locations, function(location) {
      return location.dates.length === 0;
    }))));

    // stays = grunt.file.readJSON(options.src);

    // var geoJSON = stays.locations.map(function(location) {
    //   return {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "Point",
    //       "coordinates": [+location.longitude, +location.latitude]
    //     },
    //     "properties": {
    //       "name": location.name
    //     }
    //   }
    // });
    // grunt.file.write(options.out, JSON.stringify({
    //   type: 'featureCollection',
    //   features: geoJSON
    // }));


    grunt.log.writeln('OK'.green);
  });
}