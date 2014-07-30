define(
  [
  ],
  function () {
    'use strict';

    return L.Icon.extend({
        options: {
            prefix: 'nif-icon'
        },

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        createIcon: function () {
          var div = document.createElement('div'),
              options = this.options;

          div.className = 'map-marker';

          if (options.icon) {
            div.innerHTML = this._createInner();
          }
          return div;
        },

        _createInner: function() {
          var iconClass, options = this.options;

          if(options.icon.slice(0,options.prefix.length+1) === options.prefix + "-") {
            iconClass = options.icon;
          } else {
            iconClass = options.prefix + "-" + options.icon;
          }

          return "<span class='" + options.prefix + " " + iconClass + "'></span>";
        },

        createShadow: function () {
          var div = document.createElement('div');
          div.className = 'map-marker-shadow';
          return div;
      }

    });
         
  }
);