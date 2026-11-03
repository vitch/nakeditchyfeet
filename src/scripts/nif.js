import './globals.js';
import 'bootstrap/js/tooltip.js';
import 'leaflet.markercluster/dist/leaflet.markercluster-src.js';

import $ from 'jquery';
import MapItemsCollection from './collections/MapItemsCollection.js';
import SideNavView from './views/SideNavView.js';
import HomeView from './views/HomeView.js';
import MapView from './views/MapView.js';
import SideMapView from './views/SideMapView.js';
import PhotoView from './views/PhotoView.js';
import PhotoSetView from './views/PhotoSetView.js';
import PostView from './views/PostView.js';

$(function () {
  $('.tt-trigger').tooltip();
  var sideNavView = new SideNavView();
  var sideMapView = new SideMapView();
  var homeView = new HomeView({ sideMapView: sideMapView });
  var postView = new PostView({ sideMapView: sideMapView });
  var photoView = new PhotoView({ sideMapView: sideMapView });
  var photoSetView = new PhotoSetView({ sideMapView: sideMapView });
  var mapView = new MapView({
    mapItems: new MapItemsCollection()
  });
});
