require.config(
  {
    paths: {
      text: '../lib/require.text'
    }
  }
);
define(
  [
    'views/HomeView'
  ],
  function (
    HomeView
  ) {
    'use strict';
    $(function() {
      var homeView = new HomeView();
    });
  }
);