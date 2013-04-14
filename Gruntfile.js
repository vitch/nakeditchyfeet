/*
 * NakedItchyFeet
 * http://nakeditchyfeet.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

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
      }
    },
    stylus: {
      site: {
        files: {
          'out/styles/styles.css': 'src/styles/styles.stylus'
        }
      }
    },
    haggerston: {
      dev: {
        options: {
          minify: false
        }
      },
      production: {
        options: {
          minify: true
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

  var target = grunt.option('target') || 'dev';

  grunt.registerTask('build', ['clean', 'copy', 'stylus', 'haggerston:' + target]);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);

};
