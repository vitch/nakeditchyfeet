define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#photoset',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            _.bindAll(this, 'updateSizes');
            this.sideMapView = options.sideMapView;
            this.imageData = this.$('img').map(function() {
              var img = $(this);
              var data = img.data();
              return {
                img: img,
                w: parseInt(data.w, 10),
                h: parseInt(data.h, 10),
                latLng: data.geo.split(',')
              };
            });
            $(window).on('resize', _.throttle(this.updateSizes, 200)).trigger('resize');
            this.initMap();
          }
        },
        initMap: function() {
          var bounds = [];
          var markers = _.map(this.imageData, function(data) {
            var marker = L.marker(
              data.latLng,
              {
                title: '?', // FIXME
                icon: L.AwesomeMarkers.icon({
                  icon: 'camera-retro',
                  prefix: 'nif-icon',
                  markerColor: 'darkblue',
                  className: 'awesome-marker'
                })
              }
            );
            marker.on('mouseover', function() {
              data.img.addClass('marker-active');
              this._icon.className = this._icon.className.replace('darkblue', 'darkred');
            });
            marker.on('mouseout', function() {
              data.img.removeClass('marker-active');
              this._icon.className = this._icon.className.replace('darkred', 'darkblue');
            });
            marker.on('click', function() {
              document.location = data.img.parent().attr('href');
            });
            data.img.on('mouseover', function() {
              marker._icon.className = marker._icon.className.replace('darkblue', 'darkred');
            });
            data.img.on('mouseout', function() {
              marker._icon.className = marker._icon.className.replace('darkred', 'darkblue');
            });
            bounds.push(marker.getLatLng());
            return marker;
          });
          this.sideMapView.setMarkers(markers);
          this.sideMapView.fitBounds(bounds);
        },
        updateSizes: function() {
          this.margin = 5;
          this.maxHeight = 200;
          var availableWidth = this.$el.width() - this.margin;
          if (availableWidth != this.availableWidth) {
            var currentRow = [];
            var currentRowWidth = 0;
            _.each(this.imageData, function(data) {
              data.scaledWidth = this.maxHeight / data.h * data.w;
              currentRow.push(data);
              currentRowWidth += data.scaledWidth + this.margin;
              if (currentRowWidth > availableWidth) {
                this.calculateRow(currentRow, currentRowWidth, availableWidth);
                currentRow = [];
                currentRowWidth = 0;
              }
            }, this);

            // this.calculateRow(currentRow, currentRowWidth, availableWidth);
            _.each(currentRow, function(item) {
              item.img.css({height: this.maxHeight})
            }, this)

            this.availableWidth = availableWidth;
          }
        },
        calculateRow: function(currentRow, currentRowWidth, availableWidth) {
          var ratio = availableWidth / currentRowWidth;
          var destHeight = Math.round(ratio * this.maxHeight);
          var totalW = 0;
          var sized = _.map(currentRow, function(item) {
            var w = Math.round(item.scaledWidth * ratio);
            totalW += w;
            return {
              img: item.img,
              width: w,
              height: destHeight
            }
          });
          // Clean up rounding errors so everything lines up perfectly...
          var widthDiff = availableWidth - totalW - sized.length * this.margin;
          var dir = -1;
          if (widthDiff < 0) {
            dir = 1;
            widthDiff *= -1;
          }
          var which = 0;
          while (widthDiff-- > 0) {
            sized[which].width -= dir;
            which = (which + 1) % sized.length;
          }
          // Apply sizes at end to avoid layout thrashing...
          _.each(sized, function(item) {
            item.img.css({
              width: item.width,
              height: item.height
            });
          });
        }
      }
    );
  }
);
