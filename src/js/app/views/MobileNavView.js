define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#mobile-nav',
        events: {
          'click a': 'onMenuClicked'
        },
        initialize: function (options) {
          var siteHeader = this.siteHeader = $('#site-header');
          enquire.register("screen and (min-width: 500px)", {
            match: function() {
              siteHeader.removeClass('is-open');
            }
          });
        },
        onMenuClicked: function(e) {
          this.siteHeader[this.siteHeader.is('.is-open') ? 'removeClass' : 'addClass']('is-open');
          return false;
        }
      }
    );
  }
);