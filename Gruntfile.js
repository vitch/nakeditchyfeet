/*
 * NakedItchyFeet
 * http://nakeditchyfeet.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {


  var target = grunt.option('target') || 'dev';

  // TODO: Is there a cleaner way to make these variables available in the options files?
  grunt.isProduction = target !== 'dev';
  grunt.jsLibs = [
    'vendor/underscore/underscore.js',
    'vendor/backbone/backbone.js',
    'vendor/leaflet-dist/leaflet-src.js',
    'vendor/leaflet.markercluster/dist/leaflet.markercluster-src.js',
    'vendor/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
    'vendor/bootstrap/js/tooltip.js',
    'vendor/enquire/dist/enquire.js'
  ];


  // Load custom tasks...
  grunt.loadTasks('grunt/tasks');

  // Load config and initialise...
  require('load-grunt-config')(grunt, {
    configPath: path.join(__dirname, 'grunt/options'),
    init: true
  });

  // Aliases
  grunt.registerTask('copyJsLibs', [grunt.isProduction ? 'uglify:libs' : 'copy:libs', 'copy:require']);
  grunt.registerTask('compileJs', [grunt.isProduction ? 'requirejs:compile' : 'copy:js']);

  grunt.registerTask('copyVendor', ['copy:jQuery', 'copy:fonts', 'copy:leaflet', 'copy:awesomeMarkers'])

  grunt.registerTask('build', ['clean', 'copy:main', 'copyVendor', 'copyJsLibs', 'compileJs', 'less', 'haggerston', 'stays']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);


};
