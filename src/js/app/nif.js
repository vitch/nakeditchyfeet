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
    'views/MobileNavView',
    'views/SideMapView',
    'views/PhotoView'
  ],
  function (MapItemsCollection, HomeView, MapView, MobileNavView, SideMapView, PhotoView) {
    'use strict';
    $(function() {
      $('.tt-trigger').tooltip();
      var homeView = new HomeView();
      var mapView = new MapView({
        mapItems: new MapItemsCollection()
      });
      var mobileNavView = new MobileNavView();
      var photoView = new PhotoView();
      var sideMapView = new SideMapView();
    });
  }
);