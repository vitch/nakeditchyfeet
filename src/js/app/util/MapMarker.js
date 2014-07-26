define(
  [
  ],
  function () {
    'use strict';

    var MapMarker = L.Marker.extend({
      options: {
        hoverable: true
      },
      initialize: function (latlng, options) {
        options.icon = L.AwesomeMarkers.icon({
          icon: options.iconClass,
          prefix: 'nif-icon',
          markerColor: 'darkblue',
          className: 'awesome-marker'          
        });

        L.Marker.prototype.initialize.call(this, latlng, options);
      },
      _initIcon: function () {
        L.Marker.prototype._initIcon.call(this);
        if (this.options.hoverable) {
          L.DomEvent
            .on(this._icon, 'mouseover', this._handleHoverOn, this)
            .on(this._icon, 'mouseout', this._handleHoverOff, this);
          if (this.options.associatedElement) {
            L.DomEvent
              .on(this.options.associatedElement, 'mouseover', this._handleAssociatedElementHoverOn, this)
              .on(this.options.associatedElement, 'mouseout', this._handleAssociatedElementHoverOff, this);
          }
        }
      },
      _removeIcon: function() {
        L.Marker.prototype._removeIcon.call(this);
        if (this.options.hoverable && this.options.associatedElement) {
          L.DomEvent
              .off(this.options.associatedElement, 'mouseover', this._handleAssociatedElementHoverOn)
              .off(this.options.associatedElement, 'mouseout', this._handleAssociatedElementHoverOff);
        }
      },
      _handleHoverOn: function() {
        L.DomUtil.addClass(this._icon, 'marker-active');
        if (this.options.associatedElement) {
          L.DomUtil.addClass(this.options.associatedElement, 'marker-active');
        }
        this._bringToFront();
      },
      _handleHoverOff: function() {
        L.DomUtil.removeClass(this._icon, 'marker-active');
        if (this.options.associatedElement) {
          L.DomUtil.removeClass(this.options.associatedElement, 'marker-active');
        }
        this._resetZIndex();
      },
      // TODO: I guess these don't actually need to be different?
      _handleAssociatedElementHoverOn: function() {
        this._handleHoverOn();
      },
      _handleAssociatedElementHoverOff: function() {
        this._handleHoverOff();
      }

    });

    return MapMarker;

  }
);