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
    var mapView = new MapView({
      mapItems: new MapItemsCollection()
    });
  }
);