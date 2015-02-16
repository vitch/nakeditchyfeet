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

    locations = _.reject(locations, function(location) {
      return location.dates.length === 0;
    });

    grunt.file.write(options.out, JSON.stringify(_.toArray(locations), null, 4));
    grunt.log.writeln('OK'.green);
  });
};
