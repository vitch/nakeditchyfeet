define(
  [
  ],
  function () {
    'use strict';

    // From http://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html
    var computeAngle = function(a, b) {
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
    };

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
          var planeIcon = L.divIcon({className:'map-marker-airplane', iconSize: [30, 30], html: '<span class="fa fa-plane"></span>'});
          var planeMarkers = [];
          $(window).on('resize', _.throttle(function() {
            var newW = $el.width();
            if (newW !== currentWidth) {
              leafletMap.invalidateSize();
              leafletMap.fitBounds(line.getBounds(), { padding: [15, 20]});

              _.range(linePoints.length - 1).forEach(function(i) {
                var segment = L.polyline([linePoints[i], linePoints[i+1]]);
                if (_.isUndefined(planeMarkers[i])) {
                  planeMarkers[i] = L.marker(segment.getBounds().getCenter(), {icon: planeIcon, clickable: false}).addTo(leafletMap);
                } else {
                  planeMarkers[i].setLatLng(segment.getBounds().getCenter());
                }
                var lineAngle = computeAngle(leafletMap.latLngToLayerPoint(linePoints[i]), leafletMap.latLngToLayerPoint(linePoints[i+1]));
                planeMarkers[i]._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + (lineAngle+45) + 'deg)';
              })
              
              currentWidth = newW;
            }
          }, 200)).trigger('resize');
        }
      }
    );
  }
);