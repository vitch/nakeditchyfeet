define(
  [
    'views/ListFilterView',
    'views/ListPageMapView'
  ],
  function (ListFilterView, ListPageMapView) {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#home-list',
        events: {
          'click li.has-link': 'onClickLi'
        },
        initialize: function (options) {
          if (this.$el.length) {
            this.initNowMarker();
            this.initFilters();
            this.$('.list-page-map').each(function() {
              new ListPageMapView({el: this});
            });
          }
        },
        initNowMarker: function() {
          this.nowMarker = this.$('#now-marker');

          this.updateNowMarkerMargin();
        },
        updateNowMarkerMargin: function(scroll) {
          if (this.nowMarker.length === 0) {
            return;
          }
          this.nowMarker.css('margin-top', this.initialNowMargin || (this.initialNowMargin = parseInt(this.nowMarker.css('margin-top'))));
          var nowMarkerTop = this.nowMarker.position().top;
          var whenMarkerTop = $('#when-marker').position().top;
          if (nowMarkerTop < whenMarkerTop) {
            this.nowMarker.css('margin-top', parseInt(this.nowMarker.css('margin-top')) + whenMarkerTop - nowMarkerTop);
            nowMarkerTop = this.nowMarker.position().top;
          }
          if (scroll) {
            window.scrollTo(0, Math.max(0, nowMarkerTop - whenMarkerTop));
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