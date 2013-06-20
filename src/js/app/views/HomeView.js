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
              $(this).parent('li').before('<li id="now-marker"></li>');
              return false;
            }
          });
          var nowMarker = this.$('#now-marker');
          var nowMarkerTop = nowMarker.position().top;
          var whenMarkerTop = $('#when-marker').position().top;
          if (nowMarkerTop < whenMarkerTop) {
            nowMarker.css('margin-top', parseInt(nowMarker.css('margin-top')) + whenMarkerTop - nowMarkerTop + 21);
            nowMarkerTop = nowMarker.position().top;
          }
          var destPosition = nowMarkerTop - whenMarkerTop - 16;
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