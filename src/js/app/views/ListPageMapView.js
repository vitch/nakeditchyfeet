define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        initialize: function (options) {
            var data = this.$el.data();
            this.initMap([data.fromLat, data.fromLng], [data.toLat, data.toLng]);
        },
        initMap: function (from, to) {

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


          var line = L.polyline([from, to]).addTo(leafletMap);
          $(window).on('resize', _.throttle(function() {
            leafletMap.invalidateSize();
            leafletMap.fitBounds(line.getBounds());
          }, 200)).trigger('resize');
        }
      }
    );
  }
);