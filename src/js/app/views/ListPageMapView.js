define(
  [
    'util/FlightPolyline'
  ],
  function (FlightPolyline) {
    'use strict';

    return Backbone.View.extend(
      {
        initialize: function (options) {
            this.initMap(this.$el.data('airports'));
        },
        initMap: function (airports) {

          var mapContainer = this.$el.empty()[0];

          var leafletMap = L.map(mapContainer, {
            animate: false,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            tap: false,
            trackResize: false,
            keyboard: false,
            zoomControl: false,
            attributionControl: true,
            layers:[]
          });

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i',
              attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          ).addTo(leafletMap);

          var flightPolyline = new FlightPolyline({airports: airports});
          flightPolyline.addTo(leafletMap);

          var currentWidth = 0;
          var $el = this.$el;
          $(window).on('resize', _.throttle(function() {
            var newW = $el.width();
            if (newW !== currentWidth) {
              leafletMap.invalidateSize();
              leafletMap.fitBounds(flightPolyline.getBounds(), { padding: [15, 20]});
              currentWidth = newW;
            }
          }, 200)).trigger('resize');
        }
      }
    );
  }
);