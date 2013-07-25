define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#fullsize-photo',
        events: {
        },
        initialize: function (options) {
          if (this.$el.length) {
            this.$('nav a').tooltip({ placement:'bottom' });
          }
        }
      }
    );
  }
);