define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#home-list',
        events: {
        },
        initialize: function (options) {
          var now = Date.now();
          this.$('.item').each(function() {
            var time = $(this).find('time'),
                d = new Date(time.attr('datetime')).getTime();
            if (d < now) {
              $(this).parent('li').before('<li id="now-marker"></li>')
              return false;
            }
          });

          window.scrollTo(0, this.$('#now-marker').position().top - 200);
        }
      }
    );
  }
);