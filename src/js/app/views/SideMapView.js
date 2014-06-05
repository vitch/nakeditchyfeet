define(
  [
    'util/FlightPolyline'
  ],
  function (FlightPolyline) {
    'use strict';

    var displayedMarkerJSON = '';

    return Backbone.View.extend(
      {
        el: '#side-map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            _.bindAll(this, 'sizeMap', 'updateMap');
            this.$doc = $(document);
            this.sizeMap();
            this.initMap();
            this.$doc.bind('scroll', _.throttle(this.updateMap, 400, {leading: false}));
            $(document).trigger('scroll');

            // Sidenav hover
            var siteContent = $('#site-content');
            $('#site-header').hover(function() {
              siteContent.addClass('sidenav-hover');
            }, function() {
              siteContent.removeClass('sidenav-hover');
            });
          }
        },
        initMap: function () {

          var mapContainer = this.$el.empty()[0];

          this.leafletMap = L.map(mapContainer, {
            animate: true,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            tap: false,
            trackResize: false,
            keyboard: false,
            zoomControl: false,
            maxZoom: 6
          });

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'ibm368a5',
              attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          ).addTo(this.leafletMap);

          this.stuffLayer = L.layerGroup().addTo(this.leafletMap);

          $(window).on('resize', _.throttle(this.sizeMap, 200, {leading: false}));
        },
        initTooltips: function()
        {
          this.$('.awesome-marker').not('.awesome-marker-shadow').tooltip({
            container: 'body',
            html: true
          });
        },
        updateMap: function(event) {
          var lis = $('#home-list>li').removeClass('is-in-view');
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
            var stuffLayer = this.stuffLayer;
            stuffLayer.clearLayers();
            var bounds = $('#home-list>li.is-in-view').map(function() {
              var $li = $(this);
              var domData = $li.data();
              if (!domData.marker) {
                var icon = $li.find('>.nif-icon').attr('class').split(' ')[1];
                var title = $li.find('h1').text().replace(stripSpace, '');
                var marker;
                var bounds;
                var link;
                switch (icon) {
                  case 'nif-icon-plane':
                    marker = new FlightPolyline({airports: $li.find('.list-page-map').data().airports, noPlaneMarkers: true});
                    bounds = marker.getBounds();
                    break;
                  case 'nif-icon-book':
                  case 'nif-icon-info-circle':
                  case 'nif-icon-camera-retro':
                    link = $li.find('a').attr('href');
                    // fall through...
                  default:
                    marker = L.marker(
                      domData.geo.split(','),
                      {
                        title: title,
                        icon: L.AwesomeMarkers.icon({
                          icon: icon,
                          prefix: 'nif-icon',
                          markerColor: 'darkblue',
                          className: 'awesome-marker'
                        })
                      }
                    );
                    marker.on('mouseover', function() {
                      $li.addClass('marker-active');
                      this._icon.className = this._icon.className.replace('darkblue', 'darkred');
                    });
                    marker.on('mouseout', function() {
                      $li.removeClass('marker-active');
                      this._icon.className = this._icon.className.replace('darkred', 'darkblue');
                    });
                    $li.on('mouseover', function() {
                      marker._icon.className = marker._icon.className.replace('darkblue', 'darkred');
                    });
                    $li.on('mouseout', function() {
                      marker._icon.className = marker._icon.className.replace('darkred', 'darkblue');
                    });
                    bounds = marker.getLatLng();
                }
                if (link) {
                  marker.on('click', function() {
                    document.location = link;
                  });
                }
                $li.data('marker', marker);
                $li.data('bounds', bounds);
              }
              stuffLayer.addLayer(domData.marker);
              return domData.bounds;
            }).get();
            this.leafletMap.fitBounds(bounds);
            this.initTooltips();
          }
        },
        sizeMap: function() {
          var siteContent = $('#site-content').height('auto');
          var siteContentHeight = siteContent.height();
          var win = $(window);
          var windowHeight = win.innerHeight();
          var windowWidth = win.innerWidth();
          var w = siteContent.outerWidth() + parseInt(siteContent.css('marginLeft'));
          if (siteContentHeight < windowHeight) {
            siteContent.css('height', windowHeight + 'px');
          }
          this.$el.css({
            height: windowHeight,
            width: windowWidth - w,
            left: w
          });
          this.$doc.trigger('scroll');
        }
      }
    );
  }
);