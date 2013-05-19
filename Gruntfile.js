/*
 * NakedItchyFeet
 * http://nakeditchyfeet.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var target = grunt.option('target') || 'dev';
  var compress = target !== 'dev';
  var jsLibs = [
    'js/lib/underscore-1.4.4.js',
    'js/lib/backbone-1.0.0.js',
    'js/lib/leaflet-src.js',
    'js/lib/leaflet.markercluster-src.js',
    'js/lib/leaflet.awesome-markers.js'
  ];


  // Project configuration.
  grunt.initConfig({

    clean: ['out/*'],
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'assets/',
            src: ['**'],
            dest: 'out/'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            cwd: 'src/js/app',
            src: ['**/*.js'],
            dest: 'out/js/app'
          }
        ]
      },
      libs: {
        files: [
          {
            expand: true,
            cwd: 'src/js/lib',
            src: ['**/*.js'],
            dest: 'out/js/lib'
          }
        ]
      }
    },
    less: {
      site: {
        options: {
          compress: compress,
          paths: ['src/styles', 'src/styles/bootstrap']
        },
        files: {
          'out/styles/styles.css': 'src/styles/styles.less'
        }
      }
    },
    haggerston: {
      options: {
        minify: compress,
        jsLibs: compress ? ['js/libs.min.js'] : jsLibs
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/js/app',
          appDir: '',
          wrap: true,
          insertRequire: ['nif'],
          name: 'nif',
          include: ['nif'],
          out: 'out/js/app/nif.min.js'
        }
      }
    },
    uglify: {
      libs: {
        files: {
          'out/js/libs.min.js': jsLibs.map(function(path) {
            return 'src/' + path
          })
        }
      }
    },
    watch: {
      content: {
        files: [
          'src/content/**/*.json',
          'src/content/**/*.md',
          'src/templates/**/*.html'
        ],
        tasks: 'build'
      },
      assets: {
        files: [
          'assets/**/*'
        ],
        tasks: 'copy:main'
      },
      js: {
        files: [
          'src/js/**/*.js'
        ],
        tasks: 'build'
      },
      styles: {
        files: [
          'src/styles/**/*.less'
        ],
        tasks: 'less'
      }
    },
    connect: {
      site: {
        options: {
          base: 'out/'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-haggerston');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['clean', 'copy:main', (compress ? 'uglify:libs' : 'copy:libs'), (compress ? 'requirejs:compile' : 'copy:js'), 'less', 'haggerston']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);

};
