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
    'views/MapView'
  ],
  function (MapItemsCollection, HomeView, MapView) {
    'use strict';
    $(function() {
      var homeView = new HomeView();
      var mapView = new MapView({
        mapItems: new MapItemsCollection()
      });
    });
  }
);