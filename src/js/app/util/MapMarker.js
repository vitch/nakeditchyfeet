define(
  [
    'util/MarkerBase',
    'util/MapIcon'
  ],
  function (MarkerBase, MapIcon) {
    'use strict';

    return MarkerBase.extend({

      initialize: function (latlng, options) {
        options.icon = new MapIcon({icon: options.iconClass});

        MarkerBase.prototype.initialize.call(this, latlng, options);
      }

    });

  }
);