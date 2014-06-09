define(
  [
    'views/ListFilterView',
    'util/FlightPolyline'
  ],
  function (ListFilterView,FlightPolyline) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#home-list',
        events: {
          'click li.has-link': 'onClickLi'
        },
        initialize: function (options) {
          if (this.$el.length) {

            this.initFilters();

            _.bindAll(this, 'updateMap');
            this.sideMapView = options.sideMapView;
            this.sideMapView.initMap({preventZoom:true});

            this.sideMapView.on('mapSized', this.updateMap);
            $(document).bind('scroll', _.throttle(this.updateMap, 400, {leading: false}));
            $(document).trigger('scroll');
          }
        },
        updateMap: function(event) {
          var lis = this.$('>li').removeClass('is-in-view');
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
            var stripSpace = /[\t|\n]/g;
            var markers = this.$('>li.is-in-view').map(function() {
              var $li = $(this);
              var domData = $li.data();
              if (!domData.marker) {
                var icon = $li.find('>.nif-icon').attr('class').split(' ')[1];
                var title = $li.find('h1').text().replace(stripSpace, '');
                var marker;
                var link;
                switch (icon) {
                  case 'nif-icon-plane':
                    marker = new FlightPolyline({airports: $li.find('.list-page-map').data().airports, noPlaneMarkers: true});
                    break;
                  case 'nif-icon-book':
                  case 'nif-icon-info-circle':
                  case 'nif-icon-camera-retro':
                    link = $li.find('a').attr('href');
                    // fall through...
                  default:
                    marker = L.marker(
                      domData.geo.split(','),
                      {
                        title: title,
                        icon: L.AwesomeMarkers.icon({
                          icon: icon,
                          prefix: 'nif-icon',
                          markerColor: 'darkblue',
                          className: 'awesome-marker'
                        })
                      }
                    );
                    marker.on('mouseover', function() {
                      $li.addClass('marker-active');
                      this._icon.className = this._icon.className.replace('darkblue', 'darkred');
                    });
                    marker.on('mouseout', function() {
                      $li.removeClass('marker-active');
                      this._icon.className = this._icon.className.replace('darkred', 'darkblue');
                    });
                    $li.on('mouseover', function() {
                      if (marker._icon) { // FIXME: This is for if the map isn't shown. A bit messy tho
                        marker._icon.className = marker._icon.className.replace('darkblue', 'darkred');
                        marker.setZIndexOffset(1000);
                      }
                    });
                    $li.on('mouseout', function() {
                      if (marker._icon) {
                        marker._icon.className = marker._icon.className.replace('darkred', 'darkblue');
                        marker.setZIndexOffset(0);
                      }
                    });
                }
                if (link) {
                  marker.on('click', function() {
                    document.location = link;
                  });
                }
                $li.data('marker', marker);
                domData.marker = marker;
              }
              return domData.marker;
            }).get();
            this.sideMapView.updateMarkers(markers);
          }
        },
        initFilters: function() {
          this.listFilterView = new ListFilterView();
          this.listFilterView.on('filterChange', _.bind(this.onFilterChange, this));
        },
        onFilterChange: function(filter) {
          if (filter) {
            this.$('>li').show().filter(':not(.item-type-' + filter + ')').hide();
            this.nowMarker.show();
          } else {
            this.$('>li').show();
          }
          this.updateNowMarkerMargin(true);
        },
        onClickLi: function(e) {
          var link = $(e.currentTarget).find('a');
          var destination = link.attr('href');
          if (link.attr('target') === '_blank') {
            window.open(destination)
          } else {
            document.location = destination;
          }
          return false;
        }
      }
    );
  }
);