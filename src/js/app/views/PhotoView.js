define(
  [
  ],
  function () {
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
              marker: L.marker(
                this.$el.data('geo').split(','),
                {
                  title: img.attr('title'),
                  icon: L.AwesomeMarkers.icon({
                    icon: 'camera-retro',
                    prefix: 'nif-icon',
                    markerColor: 'darkblue',
                    className: 'awesome-marker'
                  })
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