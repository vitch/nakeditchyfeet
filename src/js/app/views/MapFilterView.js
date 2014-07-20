define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#map-filter',
        events: {
          'click a': 'onFilterClicked'
        },
        initialize: function (options) {
          this.$('a').tooltip({placement: 'right'});
        },
        onFilterClicked: function(e) {
          var clicked = $(e.currentTarget);
          var chosenFilter = clicked.data('filter');
          this.trigger('filterChange', chosenFilter);
          this.$('a.active').removeClass('active');
          if (chosenFilter) {
            clicked.addClass('active');
          }
          return false;
        }
      }
    );
  }
);