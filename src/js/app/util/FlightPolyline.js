define(
  [
  ],
  function () {
    'use strict';

    // From http://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html
    var computeAngle = function(a, b) {
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
    };

    var planeIcon = L.divIcon({className:'map-marker-airplane', iconSize: [30, 30], html: '<span class="nif-icon nif-icon-plane"></span>'});

    var FlightPolyLine = L.FeatureGroup.extend({
      initialize: function(options) {

        L.FeatureGroup.prototype.initialize.call(this, options);

        var airportCoordinates = options.airports.split('||').map(function(a) {
          var latLng = a.split('|')[1].split(',')
          return [parseFloat(latLng[0]), parseFloat(latLng[1])];
        });

        this.addLayer(L.polyline(airportCoordinates, {

        }));

      }
    });

    return FlightPolyLine;
  }
);