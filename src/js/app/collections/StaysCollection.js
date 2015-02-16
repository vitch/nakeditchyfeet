define(
  [
    'models/StaysModel'
  ],
  function (StaysModel) {
    'use strict';

    return Backbone.Collection.extend(
      {
        model: StaysModel,
        url: '/stay-data.json'
      }
    );
  }
);