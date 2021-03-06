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
    'vendor/bootstrap/js/tooltip.js'
  ];


  // Load custom tasks...
  grunt.loadTasks('grunt/tasks');

  // Load config and initialise...
  require('load-grunt-config')(grunt, {
    configPath: path.join(__dirname, 'grunt/options'),
    init: true
  });

  // Aliases
  grunt.registerTask('copyJsLibs', grunt.isProduction ? ['uglify:libs', 'uglify:require'] : ['copy:libs', 'copy:require']);
  grunt.registerTask('compileJs', [grunt.isProduction ? 'requirejs:compile' : 'copy:js']);

  grunt.registerTask('copyVendor', [grunt.isProduction ? 'copy:jQueryMin' : 'copy:jQuery', 'copy:leaflet'])

  grunt.registerTask('build', ['clean', 'webfont', 'copy:fonts', 'copy:main', 'copyVendor', 'copyJsLibs', 'compileJs', 'less', 'haggerston', 'stays', 'imagemin']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);


};
