define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#map-panel',
        events: {
          'click #map-toggle a': 'onMapToggle'
        },
        initialize: function () {

          this.isOpen = this.$el.is('.is-open');
          if (this.isOpen) {
            this.initMap();
          }

          // Wait until the page has rendered before allowing CSS animations on the height of the #map div
          _.delay(
            _.bind(function () {
              this.$el.addClass('is-animated');
            }, this),
            1000
          );
        },
        initMap: function () {
          if (this.isMapInitialised) {
            return;
          }
          this.isMapInitialised = true;

          var mapContainer = this.$('#map').empty()[0],
              map = L.map(mapContainer).setView([0, 0], 2);

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i'
            }
          ).addTo(map);

//          L.tileLayer(
//            'http://a.tiles.mapbox.com/v3/vitch.map-knaif0fn/{z}/{x}/{y}.png',
//            {
//              "attribution": "<a href='http://mapbox.com/about/maps' target='_blank'>Terms & Feedback</a>",
//              "bounds": [-180, - 85, 180, 85],
//              "center": [0, 0, 3],
//              "data": ["http://a.tiles.mapbox.com/v3/vitch.map-knaif0fn/markers.geojsonp"],
//              "geocoder": "http://a.tiles.mapbox.com/v3/vitch.map-knaif0fn/geocode/{query}.jsonp",
//              "id": "vitch.map-knaif0fn",
//              "maxzoom": 17,
//              "minzoom": 0,
//              "name": "Simple terrain",
//              "private": true,
//              "scheme": "xyz",
//              "tilejson": "2.0.0",
//              "tiles": ["http://a.tiles.mapbox.com/v3/vitch.map-knaif0fn/{z}/{x}/{y}.png", "http://b.tiles.mapbox.com/v3/vitch.map-knaif0fn/{z}/{x}/{y}.png", "http://c.tiles.mapbox.com/v3/vitch.map-knaif0fn/{z}/{x}/{y}.png", "http://d.tiles.mapbox.com/v3/vitch.map-knaif0fn/{z}/{x}/{y}.png"],
//              "webpage": "http://tiles.mapbox.com/vitch/map/map-knaif0fn"
//            }
//          ).addTo(map);
        },
        onMapToggle: function (e) {
          this.isOpen = !this.isOpen;
          this.$el[this.isOpen ? 'addClass' : 'removeClass']('is-open');

          if (this.isOpen) {
            // Wait before initialising map so that it has the correct container height when it initialises
            _.delay(_.bind(this.initMap, this), 1000);
          }
          return false;
        }
      }
    );
  }
);