require.config(
  {
    paths: {
      text: '../lib/require.text'
    }
  }
);
define(
  [
    'collections/MapItemsCollection',
    'views/HomeView',
    'views/MapView',
    'views/MobileNavView'
  ],
  function (MapItemsCollection, HomeView, MapView, MobileNavView) {
    'use strict';
    $(function() {
      var homeView = new HomeView();
      var mapView = new MapView({
        mapItems: new MapItemsCollection()
      });
      var mobileNavView = new MobileNavView();
    });
  }
);