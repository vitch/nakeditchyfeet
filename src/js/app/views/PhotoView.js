define(
  [
    'util/MapMarker'
  ],
  function (MapMarker) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#fullsize-photo',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            this.$('nav a').tooltip({ placement:'bottom' });

            var img = this.$('a img');

            options.sideMapView.initMap({
              marker: new MapMarker(
                this.$el.data('geo').split(','),
                {
                  title: img.attr('title'),
                  iconClass: 'camera-retro',
                  hoverable: false
                }
              )
            });

            // Hacky way to make the height correct once the image has loaded and we know how tall it is.
            // There must be a better way?
            img.on('load', function() {
              $(window).trigger('resize');
            });
          }
        }
      }
    );
  }
);