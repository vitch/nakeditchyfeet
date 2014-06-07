define([], function() {

  var tiles = {
    // My mapbox tiles
    mapboxNIF: L.tileLayer(
      'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png',
      {
        user: 'nakeditchyfeet',
        map: 'ibm368a5',
        attribution: '<a href="http://mapbox.com/about/maps" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
      }
    ),
    // Thunderforest.Landscape (from http://leaflet-extras.github.io/leaflet-providers/preview/index.html)
    thunderforestLandscape: L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    // Stamen.Watercolor (from http://leaflet-extras.github.io/leaflet-providers/preview/index.html)
    stamenWatercolor: L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      subdomains: 'abcd',
      minZoom: 3,
      maxZoom: 16
    }),
    // Esri.WorldPhysical (from http://leaflet-extras.github.io/leaflet-providers/preview/index.html)
    esriWorldPhysical: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
      maxZoom: 8
    })
  };

  return tiles.mapboxNIF;


});