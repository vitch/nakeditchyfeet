import L from 'leaflet';

// Esri World Physical (see https://leaflet-extras.github.io/leaflet-providers/preview/ for others).
export const TILES_MAX_ZOOM = 8;

export function createTileLayer(): L.TileLayer {
  return L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
      maxZoom: TILES_MAX_ZOOM,
    },
  );
}
