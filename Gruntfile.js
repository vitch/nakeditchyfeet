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

  // Project configuration.
  grunt.initConfig({

    clean: ['out/'],
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
        files: {
          'out/js/nif.js': 'src/js/nif.js'
        }
      }
    },
    stylus: {
      site: {
        options: {
          compress: compress
        },
        files: {
          'out/styles/styles.css': 'src/styles/styles.stylus'
        }
      }
    },
    haggerston: {
      options: {
        minify: compress
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/js',
          appDir: '',
          wrap: true,
          insertRequire: ['nif'],
          name: 'nif',
          include: ['nif'],
          out: 'out/js/nif.min.js'
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
      js: {
        files: [
          'src/js/**/*.js'
        ],
        tasks: 'build'
      },
      styles: {
        files: [
          'src/styles/**/*.stylus'
        ],
        tasks: 'stylus'
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
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('build', ['clean', 'copy:main', (compress ? 'requirejs:compile' : 'copy:js'), 'stylus', 'haggerston']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);

};
