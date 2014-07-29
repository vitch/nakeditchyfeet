define(
  [
    'util/MarkerBase'
  ],
  function (MarkerBase) {
    'use strict';

    return MarkerBase.extend({

      initialize: function (latlng, options) {
        options.icon = L.AwesomeMarkers.icon({
          icon: options.iconClass,
          prefix: 'nif-icon',
          markerColor: 'darkblue',
          className: 'awesome-marker'          
        });

        MarkerBase.prototype.initialize.call(this, latlng, options);
      }

    });

  }
);