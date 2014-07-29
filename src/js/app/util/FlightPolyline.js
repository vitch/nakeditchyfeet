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

    var airportIcon = L.divIcon({className:'map-marker-airport', iconSize: [4, 4], html: ''});

    var FlightPolyLine = L.FeatureGroup.extend({

      initialize: function(options) {
        L.setOptions(this, options);

        var layers = [];

        var airportCoordinates = options.airports.split('||').map(function(a) {

          var data = a.split('|');
          var latLng = data[1].split(',').map(function(n) {
            return parseFloat(n);
          });

          var marker = new MarkerBase(latLng, {
            icon: airportIcon,
            title: data[0],
            zIndexOffset: -1000
          });

          layers.push(marker);

          return latLng
        }, this);



        this.line = L.polyline(airportCoordinates, {
          color: '#000',
          opacity: .5,
          // dashArray: '15, 10, 5, 10, 15',
          weight: 4
        });

        layers.push(this.line);

        L.FeatureGroup.prototype.initialize.call(this, layers);

        if (this.options.associatedElement) {
          L.DomEvent
            .on(this.options.associatedElement, 'mouseover', this._handleAssociatedElementHoverOn, this)
            .on(this.options.associatedElement, 'mouseout', this._handleAssociatedElementHoverOff, this);
        }
      },
      _handleAssociatedElementHoverOn: function(e) {
        this.line.setStyle({color: '#F16522'});
        L.DomUtil.addClass(this.options.associatedElement, 'marker-active');
      },
      _handleAssociatedElementHoverOff: function(e) {
        this.line.setStyle({color: '#000'});
        L.DomUtil.removeClass(this.options.associatedElement, 'marker-active');
      }
    });

    return FlightPolyLine;
  }
);