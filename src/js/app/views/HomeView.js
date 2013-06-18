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
          var destPosition = this.$('#now-marker').position().top - $('#when-marker').position().top - 16;
          window.scrollTo(0, destPosition);
          // TODO: Cancel this listener if the user chooses to scroll manually in the meantime
          $(window).on('load', function() {
            window.scrollTo(0, destPosition);
          });
        }
      }
    );
  }
);