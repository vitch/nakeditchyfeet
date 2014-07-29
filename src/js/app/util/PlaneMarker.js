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

    return MarkerBase.extend({

      initialize: function (latlng, options) {

        options.icon = L.divIcon({
          className:'map-marker-airplane', 
          iconSize: [10,10], 
          html: '<span class="nif-icon nif-icon-plane"></span>'
        });

        MarkerBase.prototype.initialize.call(this, latlng, options);
      },
      _initIcon: function() {
        MarkerBase.prototype._initIcon.call(this);

        var lineAngle = computeAngle(this._map.latLngToLayerPoint(this.options.points[0]), this._map.latLngToLayerPoint(this.options.points[1]));

        this._icon.firstChild.style[L.DomUtil.TRANSFORM] = 'rotate(' + Math.round(lineAngle + 45) + 'deg)';

      }

    });

  }
);