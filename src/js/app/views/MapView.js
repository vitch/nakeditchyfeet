define(
  [
    'views/MapFilterView',
    'util/FlightPolyline',
    'util/MapMarker',
    'util/Tileset'
  ],
  function (MapFilterView, FlightPolyline, MapMarker, Tileset) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            _.bindAll(this, 'sizeMap', 'onMapItemsReady', 'sizeMap', 'onFilterChange');

            this.sizeMap();
            this.mapItems = options.mapItems;
            this.initMap();
          }
        },
        initMap: function () {

          var mapContainer = this.$el[0],
              initTooltips = this.initTooltips;

          this.leafletMap = L.map(mapContainer, {
            minZoom: Tileset.options.minZoom || 2,
            maxZoom: Tileset.options.maxZoom || null
          }).fitWorld();

          Tileset.addTo(this.leafletMap);

          this.mapItems.fetch({success: this.onMapItemsReady});
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
            var marker = new MapMarker(
              [mapItemModel.get('latitude'), mapItemModel.get('longitude')],
              {
                title: mapItemModel.get('title').replace(/&#39;/g, '\''),
                iconClass: mapItemModel.get('icon'),
                model: mapItemModel
              }
            );
            marker.on('click', function(e) {
              document.location.href = '/' + mapItemModel.get('link');
            });
            mapItemClusters.addLayer(marker);
            return marker;
          });

          map.fitBounds(this.mapMarkers.map(function(marker) {
            return marker.getLatLng();
          }));

          var flightLayers = [];

          flights.forEach(function(mapItemModel) {
            var flightPolyline = new FlightPolyline({airports: mapItemModel.get('airports')});
            flightLayers.push(flightPolyline);
          });

          this.flightLayerGroup = L.layerGroup(flightLayers).addTo(this.leafletMap);

          map.addLayer(mapItemClusters);

          $(window).on('resize', _.throttle(this.sizeMap, 200));

          this.initFilters();
        },
        initFilters: function() {
          this.mapFilterView = new MapFilterView();
          this.mapFilterView.on('filterChange', this.onFilterChange);
        },
        onFilterChange: function(filter) {
          this.mapItemClusters.addLayers(this.hiddenMarkers);
          if (!this.leafletMap.hasLayer(this.flightLayerGroup)) {
            this.leafletMap.addLayer(this.flightLayerGroup);
          }
          if (filter) {
            this.hiddenMarkers = this.mapMarkers.filter(function(marker) {
              return marker.options.model.get('type') !== filter;
            });
            if (filter != 'flight') {
              this.leafletMap.removeLayer(this.flightLayerGroup);
            }
          } else {
            this.hiddenMarkers = [];
          }
          this.mapItemClusters.removeLayers(this.hiddenMarkers);
        },
        sizeMap: function() {
          this.$el.height($(window).innerHeight());
          if (this.leafletMap) {
            this.leafletMap.invalidateSize();
          }
        }
      }
    );
  }
);