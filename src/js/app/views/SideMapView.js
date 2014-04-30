define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#side-map',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            _.bindAll(this, 'sizeMap', 'updateMap');
            this.$doc = $(document);
            this.sizeMap();
            this.initMap();
            this.$doc.bind('scroll', _.throttle(this.updateMap, 400, {leading: false}));
            this.$doc.trigger('scroll');
          }
        },
        initMap: function () {

          var mapContainer = this.$el.empty()[0];

          this.leafletMap = L.map(mapContainer, {
            animate: false,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            tap: false,
            trackResize: false,
            keyboard: false,
            zoomControl: false,
          }).fitWorld();

          L.tileLayer(
            'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
            {
              user: 'nakeditchyfeet',
              map: 'map-9xnn0a7i',
              attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          ).addTo(this.leafletMap);

          $(window).on('resize', _.throttle(this.sizeMap, 200, {leading: false}));
        },
        updateMap: function(event) {
          var lis = $('#home-list>li').removeClass('is-in-view');
          if (lis.length) {
            var w = $(window);
            var scrollTop = w.scrollTop(); // window.scrollY?
            var viewportHeight = w.height();
            lis.each(function(i, li) {
              var $li = $(li);
              var top = $li.position().top;
              var h = $li.height();
              if (top + h < scrollTop || $li.is('#now-marker')) {
                return true;
              } else if (top > scrollTop + viewportHeight) {
                return false;
              }
              $li.addClass('is-in-view');
            });
            var datas = $('#home-list>li.is-in-view').map(function() {
              var $li = $(this);
              var data = {
                icon: $li.find('>.fa').attr('class').split(' ')[1]
              };
              switch (data.icon) {
                case 'fa-plane':
                  data.isPlane = true;
                  data.airports = $li.find('.list-page-map').data().airports;
                  break;
                default:
                  data.geo = $li.data().geo;
              }
              return data;
            }).get();
          }
          // TODO: Clear the map and then add the relevant markers to the map
          console.log(JSON.stringify(datas));
        },
        sizeMap: function() {
          var siteContent = $('#site-content');
          this.$el.height($(window).innerHeight() - parseInt(siteContent.css('marginTop')));
          var w = siteContent.width() + parseInt(siteContent.css('marginLeft')) + 10;
          this.$el.width($(window).innerWidth() - w);
          this.$el.css('left', w);
          this.$doc.trigger('scroll');
        }
      }
    );
  }
);