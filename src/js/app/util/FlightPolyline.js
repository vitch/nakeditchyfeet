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

    var replaceRotation = /(.*)rotate\((.*)deg\)/;

    var FlightPolyLine = L.FeatureGroup.extend({
      initialize: function(options) {
        this._layers = {};

        var airportCoordinates = options.airports.split('||').map(function(a) {
          var latLng = a.split('|')[1].split(',')
          return new L.LatLng(latLng[0], latLng[1]);
        });
        this.addLayer(L.polyline(airportCoordinates, {color: '#000', weight: 2, dashArray: '3,3'}));

        this.planeMarkers = _.range(airportCoordinates.length - 1).map(function(i) {
          var points = [airportCoordinates[i], airportCoordinates[i+1]];
          var segment = L.polyline(points);
          var planeMarker = L.marker(segment.getBounds().getCenter(), {icon: planeIcon, clickable: false, points: points});
          this.addLayer(planeMarker);
          return planeMarker;
        }, this);
      },
      positionPlanes: function() {
        var map = this._map;
        this.planeMarkers.forEach(function(planeMarker) {
          var points = planeMarker.options.points;
          var lineAngle = computeAngle(map.latLngToLayerPoint(points[0]), map.latLngToLayerPoint(points[1]));
          var iconStyle = planeMarker._icon.style[L.DomUtil.TRANSFORM];
          var rotateStr = ' rotate(' + (lineAngle + 45) + 'deg)';
          if (iconStyle.indexOf('rotate') > -1) {
            planeMarker._icon.style[L.DomUtil.TRANSFORM] = iconStyle.replace(replaceRotation, '$1' + rotateStr);
          } else {
            planeMarker._icon.style[L.DomUtil.TRANSFORM] += rotateStr;
          }
        });
      }
    });

    return FlightPolyLine;
  }
);