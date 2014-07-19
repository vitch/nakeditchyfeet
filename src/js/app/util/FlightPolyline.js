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

    var FlightPolyLine = L.GeoJSON.extend({
      initialize: function(options) {

        var airportCoordinates = options.airports.split('||').map(function(a) {
          var latLng = a.split('|')[1].split(',')
          return {x: latLng[1], y:latLng[0]};
        });
        var generator = new arc.GreatCircle(airportCoordinates[0], airportCoordinates[1], {name: 'HELLO!'});
        var line = generator.Arc(100, {offset: 10});
        console.log(line.json());


        L.setOptions(this, options);

        this._layers = {};

        this.addData(line.json());
      }
    });

    return FlightPolyLine;
  }
);