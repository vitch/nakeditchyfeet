import MarkerBase from './MarkerBase.js';
import MapIcon from './MapIcon.js';

export default MarkerBase.extend({

  initialize: function (latlng, options) {
    options.icon = new MapIcon({icon: options.iconClass});

    MarkerBase.prototype.initialize.call(this, latlng, options);
  }

});
