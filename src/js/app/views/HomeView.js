define(
  [
    'views/ListFilterView'
  ],
  function (ListFilterView) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#home-list',
        events: {
        },
        initialize: function (options) {
          this.initNowMarker();
          this.initFilters();
        },
        initNowMarker: function() {
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
        },
        initFilters: function() {
          this.listFilterView = new ListFilterView();
          this.listFilterView.on('filterChange', _.bind(this.onFilterChange, this));
        },
        onFilterChange: function(filter) {
          if (filter) {
            this.$('>li').show().filter(':not(.item-type-' + filter + ')').hide();
          } else {
            this.$('>li').show();
          }
        }
      }
    );
  }
);