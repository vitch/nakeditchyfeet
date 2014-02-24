define(
  [
    'models/StayDataModel'
  ],
  function (StayDataModel) {
    'use strict';

    return Backbone.Collection.extend(
      {
        model: StayDataModel,
        url: '/stay-data.json'
      }
    );
  }
);