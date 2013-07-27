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
  var compileJsTarget = compress ? 'requirejs:compile' : 'copy:js';
  var copyJsLibsTarget = compress ? 'uglify:libs' : 'copy:libs';

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

  var generatePhotosetPreview = function(page) {
    var listPagePhotos = page.templateData.photos.concat().sort(function(a, b) {
      var ret = 0;
      if (a.machine_tags.indexOf('nif:list_page=1') > -1) {
        ret -= 1;
      }
      if (b.machine_tags.indexOf('nif:list_page=1') > -1) {
        ret += 1;
      }
      return ret;
    }).slice(0, 5);
    return {
      type: "photo",
      icon: "camera-retro",
      target: page,
      date: new Date(page.templateData.date),
      label: "New Photoset: " + page.templateData.title,
      image: listPagePhotos,
      hasLink: true
    }
  };


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
        middleware: [
          require('grunt-haggerston/tasks/lib/middleware/markdown')(),
          require('./src/middleware/photosets')(),
          require('grunt-haggerston/tasks/lib/middleware/generate')(),
          require('./src/middleware/order')(),
          require('grunt-haggerston/tasks/lib/middleware/render')()
        ],
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
//                  image: page.templateData.headerImage,
                  hasLink: true
                }
              });
            var photos = _(pages).filter(function(page) {
              return page.prettyUrl.match(/^\/photos\/.*\/$/) !== null;
            }).map(generatePhotosetPreview);
            return blogs.concat(tips, photos);

          },
          intersperseEvents: function(pages) {
            var events = _(grunt.file.readJSON('src/data/events.json')).map(function(item) {
              item.date = new Date(item.date);
              item.hasLink = !!item.externalLink;
              return item;
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
          listPageIntro: function(item) {
            switch(item.type) {
              case 'photo':
                return item.label;
                break;
              case 'post':
              case 'tip':
                var page = item.target;
                if (page.intro) {
                  return page.intro;
                }
                var $ = cheerio.load(page.renderedTemplate);
                var firstParagraph = $('#content>p').first();
                return firstParagraph.html();

                break;
              default:
                // nothing
            }
          },
          getPhotosetData: function(pages, photosetIds) {
            return _(pages).filter(function(page) {
              return page.prettyUrl.match(new RegExp('^/photos/(' + photosetIds.join('|') + '){1}/$')) !== null;
            }).map(generatePhotosetPreview);
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
        tasks: 'haggerston'
      },
      assets: {
        files: [
          'assets/**/*'
        ],
        tasks: 'copy:main'
      },
      js: {
        files: [
          'src/js/app/**/*.js'
        ],
        tasks: compileJsTarget
      },
      jsLibs: {
        files: [
          'src/js/lib/**/*.js'
        ],
        tasks: copyJsLibsTarget
      },
      eventJson: {
        files: [
          'src/data/*.json'
        ],
        tasks: 'haggerston'
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
    },
    flickr: {
      options: {
        userId: '51035610516@N01',
        collectionId:  '46131-72157633392960182',
        // Please use your own API Key if you are using this as a template for your own site
        apiKey: '6f3e186ef51005004ece29d2d2ec8583',
        apiSecret: '5cfe6e7a9ce8b8b6'
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

  grunt.registerTask('flickr', require('./src/grunt-flickr/task.js'));

  grunt.registerTask('build', ['clean', 'copy:main', copyJsLibsTarget, compileJsTarget, 'less', 'haggerston']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);

};
