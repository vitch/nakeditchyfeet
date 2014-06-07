define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#post',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {

            this.sideMapView = options.sideMapView;
            var marker = L.marker(
                      this.$el.data('geo').split(','),
                      {
                        title: this.$('>h1').text(),
                        icon: L.AwesomeMarkers.icon({
                          icon: 'book', // FIXME - should include the correct icon in the page and grab it from there...
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