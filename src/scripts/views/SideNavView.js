import $ from 'jquery';
import Backbone from 'backbone';

export default Backbone.View.extend(
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

      var activeLink = $('#site-header a.active');
      if (activeLink.length) {
        siteContent.prepend($('<span class="active-marker"></span>').css('top', activeLink.position().top + 11));
      }

    }
  }
);
