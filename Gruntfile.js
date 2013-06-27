/*
 * NakedItchyFeet
 * http://nakeditchyfeet.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('underscore');
  var cheerio = require('cheerio');

  var target = grunt.option('target') || 'dev';
  var compress = target !== 'dev';
  var jsLibs = [
    'js/lib/underscore-1.4.4.js',
    'js/lib/backbone-1.0.0.js',
    'js/lib/leaflet-src.js',
    'js/lib/leaflet.markercluster-src.js',
    'js/lib/leaflet.awesome-markers.js',
    'js/lib/bootstrap-tooltip.js',
    'js/lib/enquire.js'
  ];

  var listFilterOptions = [
    {
      filter: 'post',
      icon: 'book',
      description: 'Blog posts'
    },
    {
      filter: 'tip',
      icon: 'info-sign',
      description: 'Travel tips'
    },
    {
      filter: 'photo',
      icon: 'camera-retro',
      description: 'Photos'
    },
    {
      filter: '',
      icon: 'ban-circle',
      description: 'Everything'
    }
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
      },
      templates: {
        files: [
          {
            expand: true,
            cwd: 'src/js/app/views/templates',
            src: ['**/*.html'],
            dest: 'out/js/app/views/templates'
          }
        ]
      }
    },
    less: {
      site: {
        options: {
          compress: compress,
          paths: ['src/styles', 'src/styles/bootstrap', 'src/styles/font-awesome']
        },
        files: {
          'out/styles/styles.css': 'src/styles/styles.less'
        }
      }
    },
    haggerston: {
      options: {
        minify: compress,
        jsLibs: compress ? ['js/libs.min.js'] : jsLibs,
        listFilterOptions: listFilterOptions,
        swigFilters: {
          listPageIconify: function(pages) {
            var blogs = _(pages).filter(function(page) {
              return page.prettyUrl.indexOf('/blog/') === 0;
            }).map(function(page) {
                return {
                  type: 'post',
                  icon: 'book',
                  target: page,
                  date: new Date(page.templateData.date),
                  label: page.templateData.title,
                  image: page.templateData.headerImage,
                  hasLink: true
                }
              });
            var tips = _(pages).filter(function(page) {
              return page.prettyUrl.match(/\/travel-tips\/.+/);
            }).map(function(page) {
                return {
                  type: 'tip',
                  icon: 'info-sign',
                  target: page,
                  date: new Date(page.templateData.date),
                  label: page.templateData.title,
                  hasLink: true
                }
              });
            return blogs.concat(tips);

          },
          intersperseEvents: function(pages) {
            var events = _(grunt.file.readJSON('src/data/events.json')).map(function(item) {
              item.date = new Date(item.date);
              item.hasLink = !!item.externalLink;
              return item;
            });

            return pages.concat(events);
          },
          addPhotosets: function(pages) {
            var events = _(grunt.file.readJSON('src/data/events.json'))
              .filter(function(item) {
                return !(_.isUndefined(item.latitude) || _.isUndefined(item.longitude))
              })
              .map(function(item) {
                return {
                  target: {
                    templateData: {
                      date: item.date,
                      title: item.label,
                      latitude: item.latitude,
                      longitude: item.longitude
                    }
                  },
                  type: item.type,
                  icon: item.icon
                };
              });

            return pages.concat(events);
          },
          published: function(pages) {
            if (compress) {
              return _(pages).filter(function(page) {
                return !page.isDraft;
              });
            }
            return pages;
          },
          withGeoData: function(pages) {
            return _(pages).filter(function(page) {
              return !_.isUndefined(page.templateData) && !(_.isUndefined(page.templateData.latitude) || _.isUndefined(page.templateData.longitude));
            });
          },
          intro: function(page) {
            if (page.intro) {
              return page.intro;
            }
            var $ = cheerio.load(page.renderedTemplate);
            return $('article>p').first().html();
          },
          geoLink: function(text, lat, lng) {
            return '<a href="https://maps.google.com/maps?q=' + lat + ',' + lng + '" data-lat="' + lat + '" data-lng="' + lng + '" class="geo-link" target="_blank"><i class="icon icon-map-marker"></i> ' + text + '</a>';
          }
        }
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
          'src/templates/**/*.html',
          'src/templates/**/*.xml'
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
      eventJson: {
        files: [
          'src/data/*.json'
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

  grunt.registerTask('build', ['clean', 'copy:main', 'copy:templates', (compress ? 'uglify:libs' : 'copy:libs'), (compress ? 'requirejs:compile' : 'copy:js'), 'less', 'haggerston']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);

};
