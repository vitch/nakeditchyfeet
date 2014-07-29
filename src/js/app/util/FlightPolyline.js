define(
  [
    'util/MarkerBase',
    'util/PlaneMarker'
  ],
  function (MarkerBase, PlaneMarker) {
    'use strict';

    var airportIcon = L.divIcon({className:'map-marker-airport', iconSize: [4, 4], html: ''});

    var FlightPolyLine = L.FeatureGroup.extend({

      initialize: function(options) {
        L.setOptions(this, options);

        var layers = [];
        var titles = [];

        var airportCoordinates = options.airports.split('||').map(function(a, i) {

          var data = a.split('|');
          var latLng = data[1].split(',').map(function(n) {
            return parseFloat(n);
          });

          var marker = new MarkerBase(latLng, {
            icon: airportIcon,
            title: data[2],
            zIndexOffset: -1000
          });

          layers.push(marker);

          titles.push(data[2]);
          if (i > 0) {
            titles[i-1] += ' - ' + data[2];
          }

          return latLng
        }, this);

        _.each(_.range(airportCoordinates.length-1), function(i) {
          var bounds = new L.LatLngBounds(airportCoordinates[i], airportCoordinates[i+1]);
          layers.push(new PlaneMarker(bounds.getCenter(), {
            points:[airportCoordinates[i], airportCoordinates[i+1]],
            title: titles[i],
            zIndexOffset: -1000
          }));
        }, this);


        this.line = L.polyline(airportCoordinates, {
          color: '#000',
          opacity: .5,
          dashArray: '5, 5, 1, 5',
          weight: 1
        });

        layers.push(this.line);

        L.FeatureGroup.prototype.initialize.call(this, layers);

        if (this.options.associatedElement) {
          L.DomEvent
            .on(this.options.associatedElement, 'mouseover', this._handleAssociatedElementHoverOn, this)
            .on(this.options.associatedElement, 'mouseout', this._handleAssociatedElementHoverOff, this);
          L.DomEvent
            .on(this, 'mouseover', this._handleAssociatedElementHoverOn, this)
            .on(this, 'mouseout', this._handleAssociatedElementHoverOff, this);
        }
      },
      _handleAssociatedElementHoverOn: function(e) {
        this.line.setStyle({color: '#F16522', weight: 3});
        L.DomUtil.addClass(this.options.associatedElement, 'marker-active');
      },
      _handleAssociatedElementHoverOff: function(e) {
        this.line.setStyle({color: '#000', weight: 1});
        L.DomUtil.removeClass(this.options.associatedElement, 'marker-active');
      }
    });

    return FlightPolyLine;
  }
);