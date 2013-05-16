define(
  [
    'views/MapView',
    'collections/MapItemsCollection'
  ],
  function (
    MapView,
    MapItemsCollection
  ) {
    'use strict';
    $(function() {
      var mapView = new MapView({
        mapItems: new MapItemsCollection()
      });
    });
  }
);