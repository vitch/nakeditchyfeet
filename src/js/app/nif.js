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
    'collections/StayDatasCollection',
    'views/HomeView',
    'views/MapView',
    'views/MobileNavView',
    'views/PhotoView'
  ],
  function (MapItemsCollection, StayDatasCollection, HomeView, MapView, MobileNavView, PhotoView) {
    'use strict';
    $(function() {
      $('.tt-trigger').tooltip();
      var homeView = new HomeView();
      var mapView = new MapView({
        mapItems: new MapItemsCollection(),
        stayData: new StayDatasCollection()
      });
      var mobileNavView = new MobileNavView();
      var photoView = new PhotoView();
    });
  }
);