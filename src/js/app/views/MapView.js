define(
  [
    'views/ListFilterView'
  ],
  function (ListFilterView) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            _.bindAll(this, 'sizeMap', 'onMapItemsReady', 'initTooltips', 'sizeMap', 'onFilterChange');

            this.sizeMap();
            this.mapItems = options.mapItems;
            this.initMap();
          }
        },
        initMap: function () {

          var mapContainer = this.$el.empty()[0],
              initTooltips = this.initTooltips;

          this.leafletMap = L.map(mapContainer).fitWorld();

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i',
              attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          ).addTo(this.leafletMap);

          this.leafletMap.on('zoomend moveend', function(){
            _.defer(initTooltips);
          });

          this.mapItems.fetch({success: this.onMapItemsReady});
        },
        initTooltips: function()
        {
          this.$('.awesome-marker').not('.awesome-marker-shadow').tooltip({
            container: 'body',
            html: true
          });
        },
        onMapItemsReady: function () {
          var map = this.leafletMap;
          var mapItemClusters = this.mapItemClusters = new L.MarkerClusterGroup({
            showCoverageOnHover: false
          });
          this.hiddenMarkers = [];
          var flights = [];
          var pages = this.mapItems.filter(function(mapItemModel) {
            if (mapItemModel.get('type') === 'flight') {
              flights.push(mapItemModel);
              return false;
            }
            return true;
          });

          this.mapMarkers = pages.map(function(mapItemModel) {
            var marker = L.marker(
                  [mapItemModel.get('latitude'), mapItemModel.get('longitude')],
                  {
                    title: mapItemModel.get('title').replace(/&#39;/g, '\''),
                      icon: L.AwesomeMarkers.icon({
                        icon: mapItemModel.get('icon'),
                        prefix: 'fa',
                        color: 'darkblue',
                        className: 'awesome-marker'
                      }),
                    model: mapItemModel
                  }
                );
            marker.on('click', function(e) {
              document.location.href = '/' + mapItemModel.get('link');
            });
            mapItemClusters.addLayer(marker);
            return marker;
          });

          this.flightLines = flights.map(function(mapItemModel) {
            var airportCoordinates = mapItemModel.get('airports').split('||').map(function(a) {
              var latLng = a.split('|')[1].split(',')
              return new L.LatLng(latLng[0], latLng[1]);
            });
            return L.polyline(airportCoordinates, {color: '#000', weight: 2, dashArray: '3,3'}).addTo(map);
          });

          map.fitBounds(this.mapMarkers.map(function(marker) {
            return marker.getLatLng();
          }));

          map.addLayer(mapItemClusters);

          $(window).on('resize', _.throttle(this.sizeMap, 200));

          this.initTooltips();
          this.initFilters();
        },
        initFilters: function() {
          this.listFilterView = new ListFilterView();
          this.listFilterView.on('filterChange', this.onFilterChange);
        },
        onFilterChange: function(filter) {
          this.mapItemClusters.addLayers(this.hiddenMarkers);
          if (filter) {
            this.hiddenMarkers = this.mapMarkers.filter(function(marker) {
              return marker.options.model.get('type') !== filter;
            });
          } else {
            this.hiddenMarkers = [];
          }
          this.mapItemClusters.removeLayers(this.hiddenMarkers);
          this.initTooltips();
        },
        sizeMap: function() {
          this.$el.height($(window).innerHeight() - 20 - parseInt($('#site-content').css('marginTop')));
        }
      }
    );
  }
);