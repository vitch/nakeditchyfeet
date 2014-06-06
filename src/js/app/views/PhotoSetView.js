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
            this.imageData = this.$('img').map(function() {
              var img = $(this);
              var data = img.data();
              return {
                img: img,
                w: parseInt(data.w, 10),
                h: parseInt(data.h, 10)
              };
            });
            $(window).on('resize', _.throttle(this.updateSizes, 200)).trigger('resize');
          }
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
                currentRowWidth += this.margin;
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
          // console.log('ROW', currentRow, availableWidth, currentRowWidth, ratio);
          var destHeight = Math.round(ratio * this.maxHeight);
          _.each(currentRow, function(item, i) {
            // console.log('Item', i, item.scaledWidth, '=>', Math.floor(item.scaledWidth * ratio));
            item.img.css({
              width: item.scaledWidth * ratio, 
              height: destHeight
            });
          });
        }
      }
    );
  }
);
