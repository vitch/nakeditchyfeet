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
    'views/SideNavView',
    'views/HomeView',
    'views/MapView',
    'views/SideMapView',
    'views/PhotoView'
  ],
  function (MapItemsCollection, SideNavView, HomeView, MapView, SideMapView, PhotoView) {
    'use strict';
    $(function() {
      $('.tt-trigger').tooltip();
      var sideNavView = new SideNavView();
      var homeView = new HomeView();
      var mapView = new MapView({
        mapItems: new MapItemsCollection()
      });
      var photoView = new PhotoView();
      var sideMapView = new SideMapView();
    });
  }
);