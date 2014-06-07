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
    'views/PhotoView',
    'views/PhotoSetView',
    'views/PostView'
  ],
  function (MapItemsCollection, SideNavView, HomeView, MapView, SideMapView, PhotoView, PhotoSetView, PostView) {
    'use strict';
    $(function() {
      $('.tt-trigger').tooltip();
      var sideNavView = new SideNavView();
      var sideMapView = new SideMapView();
      var homeView = new HomeView({sideMapView:sideMapView});
      var postView = new PostView({sideMapView:sideMapView});
      var photoView = new PhotoView({sideMapView:sideMapView});
      var mapView = new MapView({
        mapItems: new MapItemsCollection()
      });
      var photoSetView = new PhotoSetView();
    });
  }
);