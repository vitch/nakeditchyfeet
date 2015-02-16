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
    'collections/StaysCollection',
    'views/SideNavView',
    'views/HomeView',
    'views/MapView',
    'views/SideMapView',
    'views/PhotoView',
    'views/PhotoSetView',
    'views/PostView'
  ],
  function (MapItemsCollection, StaysCollection, SideNavView, HomeView, MapView, SideMapView, PhotoView, PhotoSetView, PostView) {
    'use strict';
    $(function() {
      $('.tt-trigger').tooltip();
      var sideNavView = new SideNavView();
      var sideMapView = new SideMapView();
      var homeView = new HomeView({sideMapView:sideMapView});
      var postView = new PostView({sideMapView:sideMapView});
      var photoView = new PhotoView({sideMapView:sideMapView});
      var photoSetView = new PhotoSetView({sideMapView:sideMapView});
      var mapView = new MapView({
        mapItems: new MapItemsCollection(),
        stays: new StaysCollection()
      });
    });
  }
);