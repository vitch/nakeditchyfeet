define(
  [
    'util/MapMarker'
  ],
  function (MapMarker) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#post',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {

            options.sideMapView.initMap({
              marker: new MapMarker(
                this.$el.data('geo').split(','),
                {
                  title: this.$('>h1').text(),
                  iconClass: 'book' // FIXME - should include the correct icon in the page and grab it from there...
                }
              )
            });

          }
        }
      }
    );
  }
);