define(
  [
    'models/MapItemModel'
  ],
  function (MapItemModel) {
    'use strict';

    return Backbone.Collection.extend(
      {
        model: MapItemModel,
        url: '/map-data.json'
      }
    );
  }
);