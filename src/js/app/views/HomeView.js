define(
  [
    'util/FlightPolyline',
    'util/MapMarker'
  ],
  function (FlightPolyline, MapMarker) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#home-list',
        events: {
          'click li.has-link': 'onClickLi'
        },
        initialize: function (options) {
          if (this.$el.length) {

            _.bindAll(this, 'updateMap');
            this.sideMapView = options.sideMapView;
            this.sideMapView.initMap({preventZoom:true});

            this.sideMapView.on('mapSized', this.updateMap);
            $(document).bind('scroll', _.throttle(this.updateMap, 400, {leading: false}));
            $(document).trigger('scroll');
          }
        },
        updateMap: function(event) {
          var lis = this.$('>li').removeClass('is-in-view');
          if (lis.length) {
            var w = $(window);
            var scrollTop = w.scrollTop(); // window.scrollY?
            var viewportHeight = w.height();
            lis.each(function(i, li) {
              var $li = $(li);
              var top = $li.position().top;
              var h = $li.height();
              if (top + h < scrollTop || $li.is('#now-marker')) {
                return true;
              } else if (top > scrollTop + viewportHeight) {
                return false;
              }
              $li.addClass('is-in-view');
            });
            var stripSpace = /[\t|\n]/g;
            var markers = this.$('>li.is-in-view').map(function() {
              var $li = $(this);
              var domData = $li.data();
              if (!domData.marker) {
                var icon = $li.find('>.nif-icon');
                if (icon.length) {
                  icon = icon.attr('class').split(' ')[1];
                } else {
                  icon = 'nif-icon-plane';
                }
                var title = $li.find('h1').text().replace(stripSpace, '');
                var marker;
                var link;
                switch (icon) {
                  case 'nif-icon-plane':
                    marker = new FlightPolyline({
                      airports: $li.find('div[data-airports]').data().airports, 
                      noPlaneMarkers: true,
                      associatedElement: $li[0]
                    });
                    break;
                  case 'nif-icon-book':
                  case 'nif-icon-info-circle':
                  case 'nif-icon-camera-retro':
                    link = $li.find('a').attr('href');
                    // fall through...
                  default:
                    marker = new MapMarker(domData.geo.split(','), { 
                      title: title,
                      iconClass: icon,
                      associatedElement: $li[0]
                    });
                }
                if (link) {
                  marker.on('click', function() {
                    document.location = link;
                  });
                }
                $li.data('marker', marker);
                domData.marker = marker;
              }
              return domData.marker;
            }).get();
            this.sideMapView.updateMarkers(markers);
          }
        },
        onClickLi: function(e) {
          var link = $(e.currentTarget).find('a');
          var destination = link.attr('href');
          if (link.attr('target') === '_blank') {
            window.open(destination)
          } else {
            document.location = destination;
          }
          return false;
        }
      }
    );
  }
);