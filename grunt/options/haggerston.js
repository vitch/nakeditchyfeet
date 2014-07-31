var _ = require('underscore');
var cheerio = require('cheerio');
var marked = require('marked');


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
    filter: 'flight',
    icon: 'plane',
    description: 'Flights'
  },
  {
    filter: '',
    icon: 'ban',
    description: 'Everything'
  }
];

var generatePhotosetPreview = function(page, i) {
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
    photosetData: {
      big: listPagePhotos[0],
      small: listPagePhotos.slice(1,5),
      side: i%2
    },
    geo: page.templateData.latitude + ',' + page.templateData.longitude,
    hasLink: true
  }
};

module.exports = function(grunt) {
  return {
    options: {
      minify: grunt.isProduction,
      jsLibs: grunt.isProduction ? ['js/libs.min.js'] : grunt.jsLibs.map(function(l) {return l.replace('vendor', 'js/lib'); }),
      listFilterOptions: listFilterOptions,
      middleware: [
        require('grunt-haggerston/tasks/lib/middleware/markdown')(),
        require('../../src/middleware/photosets')(),
        require('../../src/middleware/trim-tags')(),
        require('grunt-haggerston/tasks/lib/middleware/generate')(),
        require('../../src/middleware/order')(),
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
                geo: page.templateData.latitude + ',' + page.templateData.longitude,
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
                geo: page.templateData.latitude + ',' + page.templateData.longitude,
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
                lng: parts[7],
                name: parts[1].replace(/"/g, '')
              };
            }
          });
          var count = 0;
          var events = _(grunt.file.readJSON('src/data/events.json')).map(function(item) {
            item.date = new Date(item.date);
            item.hasLink = !!item.externalLink;
            if (item.icon === 'plane') {
              item.type = 'flight';
              var codes = item.airports.split(',');
              item.journey = codes.map(function(code) {
                return airports[code].name;
              }).join(' - ');
              item.label = '<span class="airport-code">' + codes[0] + '</span> ' + item.label + ' <span class="airport-code">' + codes[codes.length-1] + '</span>'
              item.destinationCode = codes.pop();
              item.airports = item.airports.split(',').map(function(code) {
                return code + '|' + airports[code].lat + ',' + airports[code].lng + '|' + airports[code].name;
              }).join('||');
            } 
            return item;
          });

          return pages.concat(events);
        },
        published: function(pages) {
          if (grunt.isProduction) {
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
        findFlights: function(pages) {
          return _(pages).filter(function(page) {
            return page.type === 'flight';
          }).map(function(page) {
            return {
              airports: page.airports
            };
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
        },
        isBlogActiveClass: function(page) {
          return page.prettyUrl.match(/(^\/$|^\/(blog|photos|tags|travel-tips)+\/)/) ? 'active' : '';
        },
        headerIcon: function(page) {
          var section = page.prettyUrl.match(/^\/([^\/]+)\//)[1];
          return {
            blog: 'book',
            'travel-tips': 'info-circle',
            'follow-us': 'twitter',
            'about-us': 'foot'
          }[section];
        }
      }
    }
  };
};