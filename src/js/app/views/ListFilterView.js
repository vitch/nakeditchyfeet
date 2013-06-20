define(
  [
    'util/Template',
    'text!views/templates/list-filter.html'
  ],
  function (Template, tmplListFiler) {
    'use strict';

    return Backbone.View.extend(
      {
        tagName: 'div',
        id: 'list-filter',
        events: {
          'click a': 'onFilterClicked'
        },
        initialize: function (options) {
          this.render();
        },
        render: function() {
          this.$el.html(Template.render('list-filter.html', tmplListFiler, {
            filters: [
              {
                filter: 'post',
                icon: 'book',
                description: 'Blog posts'
              },
              {
                filter: 'tip',
                icon: 'info-sign',
                description: 'Travel tips'
              },
              {
                filter: 'photo',
                icon: 'camera-retro',
                description: 'Photos'
              },
              {
                filter: '',
                icon: 'undo',
                description: 'Everything'
              }
            ]
          })).appendTo('#site-header');
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