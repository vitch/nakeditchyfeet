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
          this.fitBoundsParams = {
            padding: [20, 20]
          };
        },
        initMap: function (options) {

          if (this.$el.length) {

            options = _.extend({}, options, { zoom: 6})

            _.bindAll(this, 'sizeMap');
            this.sizeMap();

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

            this.leafletMap = L.map(mapContainer, mapOptions);

            Tileset.addTo(this.leafletMap);

            $(window).on('resize', _.throttle(this.sizeMap, 200, {leading: false}));

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
          this.containerLayer.clearLayers();
          var bounds = [];
          _.each(markers, function(m) {
            this.containerLayer.addLayer(m);
            bounds.push(_.isFunction(m.getBounds) ? m.getBounds() : m.getLatLng());
          }, this);
          this.leafletMap.fitBounds(bounds, this.fitBoundsParams);
          this.initTooltips();
        },
        sizeMap: function() {
          var siteContent = $('#site-content').height('auto');
          var siteContentHeight = siteContent.height();
          var win = $(window);
          var windowHeight = win.innerHeight();
          var windowWidth = win.innerWidth();
          var w = siteContent.outerWidth() + parseInt(siteContent.css('marginLeft'));
          if (siteContentHeight < windowHeight) {
            siteContent.css('height', windowHeight + 'px');
          }
          this.$el.css({
            height: windowHeight,
            width: windowWidth - w,
            left: w
          });
          if (this.leafletMap) {
            this.leafletMap.invalidateSize(false);
            this.trigger('mapSized');
          }
        }
      }
    );
  }
);