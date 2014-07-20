define(
  [
  ],
  function () {
    'use strict';

    return Backbone.View.extend(
      {
        el: '#site-header',
        initialize: function (options) {

          var siteContent = $('#site-content');
          this.$el.hover(function() {
            siteContent.css({width: siteContent.outerWidth()}).addClass('sidenav-hover');
          }, function() {
            siteContent.removeClass('sidenav-hover');
            setTimeout(function() {
              siteContent.css({width: ''});
            }, 300);
          });

          siteContent.prepend($('<span class="active-marker"></span>').css('top', $('#site-header a.active').position().top + 11));
            
        }
      }
    );
  }
);