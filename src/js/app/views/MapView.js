define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            _.bindAll(this, 'sizeMap', 'onMapItemsReady', 'initTooltips', 'sizeMap');

            this.sizeMap();
            this.mapItems = options.mapItems;
            this.initMap();
          }
        },
        initMap: function () {

          var mapContainer = this.$el.empty()[0],
              initTooltips = this.initTooltips;

          this.leafletMap = L.map(mapContainer).setView([10, 0], 2);

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i'
            }
          ).addTo(this.leafletMap);

          this.leafletMap.on('zoomend', function(){
            _.defer(initTooltips);
          });

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

          this.mapItems.fetch({success: this.onMapItemsReady});
        },
        initTooltips: function()
        {
//          this.$('.awesome-marker').not('.awesome-marker-shadow').tooltip({
//            container: 'body'
//          });
        },
        onMapItemsReady: function () {
          var map = this.leafletMap,
              mapItemClusters = new L.MarkerClusterGroup({
                showCoverageOnHover: false
              });
          this.mapItems.each(function(mapItemModel) {
            if (mapItemModel.get('latitude') == false || mapItemModel.get('longitude') == false) {
              return false;
            }
            var marker = L.marker(
                  [mapItemModel.get('latitude'), mapItemModel.get('longitude')],
                  {
                    title: mapItemModel.get('title').replace(/&#39;/g, '\''),
                      icon: L.AwesomeMarkers.icon({
                        icon: mapItemModel.get('icon'),
                        color: 'darkblue',
                        className: 'awesome-marker'
                      })
                  }
                );
            marker.on('click', function(e) {
              document.location.href = '/' + mapItemModel.get('link');
            });
            mapItemClusters.addLayer(marker);
            return marker;
          });

          map.addLayer(mapItemClusters);

          $(window).on('resize', _.throttle(this.sizeMap, 200));

          this.initTooltips();
        },
        sizeMap: function() {
          this.$el.height($(window).innerHeight() - 20);
        }
      }
    );
  }
);