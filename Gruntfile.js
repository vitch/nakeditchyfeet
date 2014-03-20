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
  var marked = require('marked');

  var target = grunt.option('target') || 'dev';
  var compress = target !== 'dev';
  var jsLibs = [
    'vendor/underscore/underscore.js',
    'vendor/backbone/backbone.js',
    'vendor/leaflet-dist/leaflet-src.js',
    'vendor/leaflet.markercluster/dist/leaflet.markercluster-src.js',
    'vendor/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
    'vendor/bootstrap/js/tooltip.js',
    'vendor/enquire/dist/enquire.js'
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
      icon: 'info-circle',
      description: 'Travel tips'
    },
    {
      filter: 'photo',
      icon: 'camera-retro',
      description: 'Photos'
    },
    {
      filter: '',
      icon: 'ban',
      description: 'Everything'
    }
  ];

  var generatePhotosetPreview = function(page) {
    var findListPagePhotosRegExp = new RegExp('nif:list_?page=1'); // Allow nif:list_page=1 and nif:listpage=1
    var listPagePhotos = page.templateData.photos.concat().sort(function(a, b) {
      if (a.machine_tags.match(findListPagePhotosRegExp)) {
        return -1;
      } 
      if (b.machine_tags.match(findListPagePhotosRegExp)) {
        return 1;
      }
      return 0;
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
      jQuery: {
        src: 'vendor/jquery/dist/jquery.js',
        dest: 'out/js/lib/jquery.js'
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
            cwd: 'vendor',
            src: ['**/*.js'],
            dest: 'out/js/lib'
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'vendor/font-awesome/fonts',
            src: ['**'],
            dest: 'out/font-awesome/fonts'
          }
        ]
      },
      awesomeMarkers: {
        files: [
          {
            expand: true,
            cwd: 'vendor/Leaflet.awesome-markers/dist/images',
            src: ['**'],
            dest: 'out/awesome-markers/images'
          }
        ]
      }
    },
    less: {
      site: {
        options: {
          compress: compress,
          paths: ['src/styles', 'vendor/bootstrap/less', 'vendor/font-awesome/less', 'vendor/Leaflet.awesome-markers/dist', 'vendor/leaflet.markercluster/dist']
        },
        files: {
          'out/styles/styles.css': 'src/styles/styles.less'
        }
      }
    },
    haggerston: {
      options: {
        minify: compress,
        jsLibs: compress ? ['js/libs.min.js'] : jsLibs.map(function(l) {return l.replace('vendor', 'js/lib'); }),
        listFilterOptions: listFilterOptions,
        middleware: [
          require('grunt-haggerston/tasks/lib/middleware/markdown')(),
          require('./src/middleware/photosets')(),
          require('./src/middleware/trim-tags')(),
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
                  icon: 'info-circle',
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
            var airports = {};
            grunt.file.read('src/data/airports.csv').split('\n').forEach(function(line) {
              var parts = line.split(',');
              if (parts.length < 7) {
                return;
              }
              var airportCode = parts[4].replace(/"/g, '');
              if (airportCode) {
                airports[airportCode] = {
                  lat: parts[6],
                  lng: parts[7]
                };
              }
            });
            var events = _(grunt.file.readJSON('src/data/events.json')).map(function(item) {
              item.date = new Date(item.date);
              item.hasLink = !!item.externalLink;
              if (item.icon === 'plane') {
                item.showMap = true;
                item.airports = item.airports.split(',').map(function(code) {
                  return code + '|' + airports[code].lat + ',' + airports[code].lng;
                }).join('||');
              }
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
                return item.target.templateData.description ? item.target.templateData.description : item.label;
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
          md: function(str) {
            return marked(str);
          },
          getPhotosetData: function(pages, photosetIds) {
            return _(pages).filter(function(page) {
              return page.prettyUrl.match(new RegExp('^/photos/(' + photosetIds.join('|') + '){1}/$')) !== null;
            }).map(generatePhotosetPreview);
          },
          geoLink: function(text, lat, lng) {
            return '<a href="https://maps.google.com/maps?q=' + lat + ',' + lng + '" data-lat="' + lat + '" data-lng="' + lng + '" class="geo-link" target="_blank"><i class="fa fa-map-marker"></i> ' + text + '</a>';
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
          'out/js/libs.min.js': jsLibs
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
        tasks: ['haggerston', 'notify:watchComplete']
      },
      assets: {
        files: [
          'assets/**/*'
        ],
        tasks: ['copy:main', 'notify:watchComplete']
      },
      js: {
        files: [
          'src/js/app/**/*.js'
        ],
        tasks: [compileJsTarget, 'notify:watchComplete']
      },
      jsLibs: {
        files: [
          'vendor/**/*.js'
        ],
        tasks: [copyJsLibsTarget, 'notify:watchComplete']
      },
      eventJson: {
        files: [
          'src/data/*.json'
        ],
        tasks: ['haggerston', 'notify:watchComplete']
      },
      styles: {
        files: [
          'src/styles/**/*.less'
        ],
        tasks: ['less', 'notify:watchComplete']
      },
      stays: {
        files: [
          'src/data/stays.json'
        ],
        tasks: ['stays', 'notify:watchComplete']
      }
    },
    connect: {
      site: {
        options: {
          base: 'out/',
          port: 3000,
          hostname: '0.0.0.0'
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
    },
    stays: {
      options: {
        src: 'src/data/stays.json',
        out: 'out/stay-data.json'
      }
    },
    notify: {
      watchComplete: {
        options: {
            message: 'Rebuild done'
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('src/grunt-tasks');

//  grunt.registerTask('flickr', require('./src/grunt-tasks/flickr.js'));
//  grunt.registerTask('stays', require('./src/grunt-tasks/stays.js'));

  grunt.registerTask('build', ['clean', 'copy:main', 'copy:jQuery', 'copy:fonts', 'copy:awesomeMarkers', copyJsLibsTarget, compileJsTarget, 'less', 'haggerston', 'stays']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);

  grunt.registerTask('default', ['build']);

};
