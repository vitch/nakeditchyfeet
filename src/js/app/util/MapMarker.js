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

        if (options.title) {
          // Hacky way to push the tooltips out to a decent width...
          var t1 = options.title.substr(0, 20);
          var t2 = options.title.substr(20);
          options.title = t1.replace(/ /g, '&nbsp;') + t2;
        }

        L.Marker.prototype.initialize.call(this, latlng, options);
      }

    });

  }
);