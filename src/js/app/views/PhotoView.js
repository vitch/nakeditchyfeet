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

            this.sideMapView = options.sideMapView;
            var marker = L.marker(
                      this.$el.data('geo').split(','),
                      {
                        title: this.$('a img').attr('title'),
                        icon: L.AwesomeMarkers.icon({
                          icon: 'camera-retro',
                          prefix: 'nif-icon',
                          markerColor: 'darkblue',
                          className: 'awesome-marker'
                        })
                      }
                    );

            this.sideMapView.setMarker(marker);
          }
        }
      }
    );
  }
);