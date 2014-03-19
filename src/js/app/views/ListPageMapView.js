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

          var linePoints = [];
          airports.forEach(function(airport) {
            var parts = airport.split('|');
            var code = parts[0];
            var latLng = new L.LatLng(parts[1].split(',')[0], parts[1].split(',')[1]);
            linePoints.push(latLng);
          });

          var line = L.polyline(linePoints, {color: '#000', weight: 2, dashArray: '3,3'}).addTo(leafletMap);
          var currentWidth = 0;
          var $el = this.$el;
          var planeMarker;
          $(window).on('resize', _.throttle(function() {
            var newW = $el.width();
            if (newW !== currentWidth) {
              leafletMap.invalidateSize();
              leafletMap.fitBounds(line.getBounds(), { padding: [15, 20]});
              if (_.isUndefined(planeMarker)) {
                var planeIcon = L.divIcon({className:'map-marker-airplane', iconSize: [30, 30], html: '<span class="fa fa-plane"></span>'});
                planeMarker = L.marker(line.getBounds().getCenter(), {icon: planeIcon}).addTo(leafletMap);
              } else {
                planeMarker.setLatLng(line.getBounds().getCenter());
              }
              currentWidth = newW;
            }
          }, 200)).trigger('resize');
        }
      }
    );
  }
);