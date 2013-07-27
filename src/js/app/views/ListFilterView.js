define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#list-filter',
        events: {
          'click a': 'onFilterClicked'
        },
        initialize: function (options) {
          this.$el.fadeIn();
          this.$('a').tooltip();
        },
        onFilterClicked: function(e) {
          var clicked = $(e.currentTarget);
          var chosenFilter = clicked.data('filter');
          this.trigger('filterChange', chosenFilter);
          this.$('a.active').removeClass('active');
          if (chosenFilter) {
            clicked.addClass('active');
          }
          $('#site-header').removeClass('is-open');
          return false;
        }
      }
    );
  }
);