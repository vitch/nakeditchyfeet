define(
  [
  ],
  function (FlightPolyline) {
    'use strict';

    var displayedMarkerJSON = '';

    return Backbone.View.extend(
      {
        el: '#side-map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {

            _.bindAll(this, 'sizeMap', 'fixCenter');
            this.sizeMap();
            this.initMap();
          }
        },
        initMap: function () {

          var mapContainer = this.$el.empty()[0];

          this.leafletMap = L.map(mapContainer, {
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
            maxZoom: 6
          });

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'ibm368a5',
              attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          ).addTo(this.leafletMap);

          this.stuffLayer = L.layerGroup().addTo(this.leafletMap);

          $(window).on('resize', _.throttle(this.sizeMap, 200, {leading: false}));
        },
        initTooltips: function()
        {
          this.$('.awesome-marker').not('.awesome-marker-shadow').tooltip({
            container: 'body',
            html: true
          });
        },
        setMarkers: function(markers) {
          this.stuffLayer.clearLayers();
          _.each(markers, function(m) {
            this.stuffLayer.addLayer(m);
          }, this);
        },
        setMarker: function(marker, zoom) {
          this.stuffLayer.clearLayers();
          this.stuffLayer.addLayer(marker);
          this.fixCenter({latLng: marker.getLatLng(), zoom: zoom || 5});
        },
        fitBounds: function(bounds) {
          this.leafletMap.fitBounds(bounds);
          this.initTooltips();
        },
        fixCenter: function(data) {
          this.off('mapSized').on('mapSized', function() {
            this._center(data);
          }, this);
          this._center(data);
        },
        _center: function(data) {
          if (data.latLng && data.zoom) {
            this.leafletMap.setView(data.latLng, data.zoom);
          } else if (data.bounds) {
            this.leafletMap.fitBounds(bounds);
          }
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
            this.trigger('mapSized');
          }
        }
      }
    );
  }
);