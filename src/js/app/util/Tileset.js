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
    thunderforestOutdoors: L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
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
    }),
    esriWorldTopoMap: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }),
    esriWorldImagery: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    esriOceanBasemap: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: 13
    }),
    esriNatGeo: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
      maxZoom: 16
    }),
    acetateTerrain: L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png', {
      attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
      subdomains: '0123',
      minZoom: 2,
      maxZoom: 18
    }),
    acetateAll: L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png', {
      attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
      subdomains: '0123',
      minZoom: 2,
      maxZoom: 18
    })
  };

  // return tiles.mapboxNIF;
  // return tiles.thunderforestLandscape;
  // return tiles.thunderforestOutdoors;
  return tiles.stamenWatercolor;
  // return tiles.esriWorldPhysical;
  // return tiles.esriWorldTopoMap;
  // return tiles.esriWorldImagery;
  // return tiles.esriOceanBasemap;
  // return tiles.esriNatGeo;
  // return tiles.acetateTerrain;
  // return tiles.acetateAll;


});