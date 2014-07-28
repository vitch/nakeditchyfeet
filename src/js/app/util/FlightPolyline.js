define(
  [
    'util/MarkerBase'
  ],
  function (MarkerBase) {
    'use strict';

    // From http://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html
    var computeAngle = function(a, b) {
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
    };

    var planeIcon = L.divIcon({className:'map-marker-airplane', iconSize: [4, 4], html: ''});

    var FlightPolyLine = L.FeatureGroup.extend({
      initialize: function(options) {

        var layers = [];

        var airportCoordinates = options.airports.split('||').map(function(a) {

          var data = a.split('|');
          var latLng = data[1].split(',').map(function(n) {
            return parseFloat(n);
          });

          var marker = new MarkerBase(latLng, {
            icon: planeIcon,
            title: data[0],
            zIndexOffset: -1000
          });

          layers.push(marker);

          return latLng
        }, this);



        layers.push(L.polyline(airportCoordinates, {
          color: '#000',
          opacity: .5,
          // dashArray: '15, 10, 5, 10, 15',
          weight: 4
        }));

        L.FeatureGroup.prototype.initialize.call(this, layers);

      }
    });

    return FlightPolyLine;
  }
);