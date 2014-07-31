define(
  [
  ],
  function () {
    'use strict';

    return L.Marker.extend({
      options: {
        hoverable: true
      },
      initialize: function (latlng, options) {

        if (options.title) {
          // Hacky way to push the tooltips out to a decent width...
          var t1 = options.title.substr(0, 20);
          var t2 = options.title.substr(20);
          options.title = t1.replace(/ /g, '&nbsp;') + t2;
        }
        L.Marker.prototype.initialize.call(this, latlng, options);
      },
      _initIcon: function () {
        L.Marker.prototype._initIcon.call(this);
        if (this.options.hoverable) {
          L.DomEvent
            .on(this._icon, 'mouseover', this._handleHoverOn, this)
            .on(this._icon, 'mouseout', this._handleHoverOff, this);
          if (this.options.title) {
            L.DomEvent.on(this._map, 'movestart zoomstart', this._handleMapMove, this);
          }
          if (this.options.associatedElement) {
            L.DomEvent
              .on(this.options.associatedElement, 'mouseover', this._handleAssociatedElementHoverOn, this)
              .on(this.options.associatedElement, 'mouseout', this._handleAssociatedElementHoverOff, this);
          }
        }
        if (this.options.title) {
          $(this._icon).tooltip({
            html: true,
            placement: 'auto'
          });
        }
      },
      _removeIcon: function() {
        L.Marker.prototype._removeIcon.call(this);
        if (this.options.hoverable) {
          if (this.options.title) {
            L.DomEvent.off(this._map, 'movestart zoomstart', this._handleMapMove, this);
          }
          if (this.options.associatedElement) {
            L.DomEvent
                .off(this.options.associatedElement, 'mouseover', this._handleAssociatedElementHoverOn)
                .off(this.options.associatedElement, 'mouseout', this._handleAssociatedElementHoverOff);
          } 
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
      _handleMapMove: function() {
        $('.tooltip').remove(); // TODO: Maybe re-attach the tooltip on zoomend/moveend? If you are still over the item??
      },
      _handleAssociatedElementHoverOn: function() {
        this._handleHoverOn();

        var tt = $(this._icon).data('bs.tooltip');
        if (tt) {
          tt.show();
        }
      },
      _handleAssociatedElementHoverOff: function() {
        this._handleHoverOff();
        $('.tooltip').remove();
        // $(this._icon).tooltip('hide'); // Should work!
      }

    });

  }
);