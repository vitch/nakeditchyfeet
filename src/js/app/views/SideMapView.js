define(
  [
    'util/Tileset'
  ],
  function (Tileset) {
    'use strict';

    var displayedMarkerJSON = '';

    return Backbone.View.extend(
      {
        el: '#side-map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {

            _.bindAll(this, 'handleResize');

            this.isMapShown = false;

            this.fitBoundsParams = {
              padding: [20, 20]
            };

            $(window).on('resize', _.throttle(this.handleResize, 200, {leading: false}));

            this.handleResize();
          }
        },
        initMap: function (options) {

          if (this.$el.length) {
            
            if (!this.isMapShown) {
              this.initMapOptions = options || {};
              return;
            }

            options = _.extend({}, options, { zoom: 6})
            this.handleResize();

            var mapContainer = this.$el.empty()[0];

            var mapOptions = {
              animate: true,
              dragging: false,
              touchZoom: false,
              scrollWheelZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              tap: false,
              trackResize: false,
              keyboard: false,
              zoomControl: false,
              minZoom: Tileset.options.minZoom || null,
              maxZoom: Tileset.options.maxZoom ? Math.min(Tileset.options.maxZoom, 11) : 11
            };

            if (options.marker) {
              mapOptions.layers = [options.marker];
              mapOptions.center = options.marker.getLatLng();
              mapOptions.zoom = options.zoom;
            } else if (options.markers) {
              mapOptions.layers = options.markers;
            } else {
              this.containerLayer = L.layerGroup();
              mapOptions.layers = [this.containerLayer]
            }

            if (options.updatedMarkers) {
              this.updateMarkers(options.updatedMarkers);
            }

            this.leafletMap = L.map(mapContainer, mapOptions);

            Tileset.addTo(this.leafletMap);

            if (options.markers) {
              this.leafletMap.fitBounds(_.map(options.markers, function(marker) {
                return _.isFunction(marker.getBounds) ? marker.getBounds() : marker.getLatLng();
              }), this.fitBoundsParams)
            }

            this.initTooltips();
          }
        },
        initTooltips: function()
        {
          this.$('.awesome-marker').not('.awesome-marker-shadow').tooltip({
            container: 'body',
            html: true
          });
        },
        updateMarkers: function(markers) {
          if (this.initMapOptions) {
            this.initMapOptions.updatedMarkers = markers;
            return;
          }
          this.containerLayer.clearLayers();
          var bounds = [];
          _.each(markers, function(m) {
            this.containerLayer.addLayer(m);
            bounds.push(_.isFunction(m.getBounds) ? m.getBounds() : m.getLatLng());
          }, this);
          this.leafletMap.fitBounds(bounds, this.fitBoundsParams);
          this.initTooltips();
        },
        handleResize: function() {
          var siteContent = $('#site-content').height('auto');
          var siteContentHeight = siteContent.height();
          var siteContentWidth;
          var siteContentLeftMargin = parseInt(siteContent.css('marginLeft'));
          var win = $(window);
          var windowHeight = win.innerHeight();
          var windowWidth = win.innerWidth();
          var isMapShown = true;

          var availableWidth = windowWidth - siteContentLeftMargin;
          if (availableWidth < 850) {
            siteContentWidth = availableWidth;
            isMapShown = false;
          } else {
            siteContentWidth = Math.min(Math.max(availableWidth * .7, 650), 860);
          }

          var w = siteContentWidth + siteContentLeftMargin;
          if (siteContentHeight < windowHeight) {
            siteContent.css({height:windowHeight});
          }

          this.$el.css({
            height: windowHeight,
            width: windowWidth - w,
            left: w
          });

          if (isMapShown && !this.isMapShown) {
            this.isMapShown = isMapShown;
            if (this.initMapOptions) {
              this.initMap(this.initMapOptions);
              this.initMapOptions = false;
            }
          }

          if (isMapShown && this.leafletMap) {
            this.leafletMap.invalidateSize(false);
            this.trigger('mapSized');
          }
        }
      }
    );
  }
);