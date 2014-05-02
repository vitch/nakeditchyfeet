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
            this.$doc.trigger('scroll');
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
          }).fitWorld();

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i',
              attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          ).addTo(this.leafletMap);

          this.stuffLayer = L.layerGroup().addTo(this.leafletMap);

          $(window).on('resize', _.throttle(this.sizeMap, 200, {leading: false}));
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
            var datas = $('#home-list>li.is-in-view').map(function() {
              var $li = $(this);
              var data = {
                icon: $li.find('>.fa').attr('class').split(' ')[1],
                title: $li.find('h1').text().replace(stripSpace, '')
              };
              switch (data.icon) {
                case 'fa-plane':
                  data.isPlane = true;
                  data.airports = $li.find('.list-page-map').data().airports;
                  break;
                case 'fa-book':
                case 'fa-info-circle':
                case 'fa-camera-retro':
                  data.link = $li.find('a').attr('href');
                  // fall through...
                default:
                  data.geo = $li.data().geo;
              }
              return data;
            }).get();
          }
          var markerJSON = JSON.stringify(datas);
          if (markerJSON !== displayedMarkerJSON) {
            displayedMarkerJSON = markerJSON;
            
            this.stuffLayer.clearLayers();
            var bounds = _.map(datas, function(data) {
              if (data.icon === 'fa-plane') {
                var planeLine = new FlightPolyline({airports: data.airports, noPlaneMarkers: true});
                planeLine.addTo(this.stuffLayer);
                return planeLine.getBounds();
              } else {
                var marker = L.marker(
                  data.geo.split(','),
                  {
                    title: data.title,
                    icon: L.AwesomeMarkers.icon({
                      icon: data.icon,
                      prefix: 'fa',
                      color: 'darkblue',
                      className: 'awesome-marker'
                    })
                  }
                );
                this.stuffLayer.addLayer(marker);
                return marker.getLatLng();
              }
            }, this);
            this.leafletMap.fitBounds(bounds);
          }
        },
        sizeMap: function() {
          var siteContent = $('#site-content');
          this.$el.height($(window).innerHeight() - parseInt(siteContent.css('marginTop')));
          var w = siteContent.width() + parseInt(siteContent.css('marginLeft')) + 10;
          this.$el.width($(window).innerWidth() - w);
          this.$el.css('left', w);
          this.$doc.trigger('scroll');
        }
      }
    );
  }
);