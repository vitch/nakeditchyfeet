define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        initialize: function (options) {
            this.initMap(this.$el.data('airports').split('||'));
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
            attributionControl: false,
            layers:[]
          });

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i'
            }
          ).addTo(leafletMap);

          var linePoints = [];
          airports.forEach(function(airport) {
            var parts = airport.split('|');
            var code = parts[0];
            var latLng = new L.LatLng(parts[1].split(',')[0], parts[1].split(',')[1]);
            linePoints.push(latLng);
          });

          var line = L.polyline(linePoints).addTo(leafletMap);
          $(window).on('resize', _.throttle(function() {
            leafletMap.invalidateSize();
            leafletMap.fitBounds(line.getBounds());
            leafletMap.setZoom(leafletMap.getZoom() - 1);
          }, 200)).trigger('resize');
        }
      }
    );
  }
);