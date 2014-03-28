define(
  [
  ],
  function () {
    'use strict';

    // From http://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html
    var computeAngle = function(a, b) {
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
    };

    var planeIcon = L.divIcon({className:'map-marker-airplane', iconSize: [30, 30], html: '<span class="fa fa-plane"></span>'});

    var FlightPolyLine = L.FeatureGroup.extend({
      initialize: function(options) {
        this._layers = {};

        var airportCoordinates = options.airports.split('||').map(function(a) {
          var latLng = a.split('|')[1].split(',')
          return new L.LatLng(latLng[0], latLng[1]);
        });
        this.addLayer(L.polyline(airportCoordinates, {color: '#000', weight: 2, dashArray: '3,3'}));

        this.airportCoordinates = airportCoordinates;
        this.planeMarkers = [];
      },
      positionPlanes: function() {
        _.range(this.airportCoordinates.length - 1).forEach(function(i) {
          var point1 = this.airportCoordinates[i];
          var point2 = this.airportCoordinates[i+1];
          var segment = L.polyline([point1, point2]);
          var currentMarker = this.planeMarkers[i];
          if (_.isUndefined(currentMarker)) {
            currentMarker = this.planeMarkers[i] = L.marker(segment.getBounds().getCenter(), {icon: planeIcon, clickable: false});
            this.addLayer(currentMarker);
          } else {
            currentMarker.setLatLng(segment.getBounds().getCenter());
          }
          var lineAngle = computeAngle(this._map.latLngToLayerPoint(point1), this._map.latLngToLayerPoint(point2));
          currentMarker._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + (lineAngle+45) + 'deg)';
        }, this);
      }
    });

    return FlightPolyLine;
  }
);