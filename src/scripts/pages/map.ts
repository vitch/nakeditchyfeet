import L from 'leaflet';
import 'leaflet.markercluster';
import { throttle, viewportSize } from '../lib/dom';
import { hideAllTooltips, tooltip } from '../lib/tooltip';
import { createFlight, createMarker } from '../map/markers';
import { boundsOf } from '../map/side-map';
import { createTileLayer, TILES_MAX_ZOOM } from '../map/tiles';

/** An item in /map-data.json (see src/pages/map-data.json.ts). */
type MapItem =
  | { type: 'flight'; airports: string }
  | {
      type: 'post' | 'tip' | 'photo';
      link: string;
      title: string;
      latitude: number;
      longitude: number;
      icon: string;
    };

/** The full screen map on /map/, with everything we've written about and our flights. */
export async function initMapPage(container: HTMLElement): Promise<void> {
  const setHeight = () => {
    container.style.height = `${viewportSize().height}px`;
  };
  setHeight();
  const map = L.map(container, { minZoom: 2, maxZoom: TILES_MAX_ZOOM }).fitWorld();
  map.on('movestart zoomstart', hideAllTooltips);
  createTileLayer().addTo(map);
  window.addEventListener(
    'resize',
    throttle(() => {
      setHeight();
      map.invalidateSize();
    }, 200),
  );

  const response = await fetch('/map-data.json');
  const items: MapItem[] = await response.json();

  const clusters = L.markerClusterGroup({ showCoverageOnHover: false });
  const markers: Array<{ type: string; marker: L.Marker }> = [];
  const flights: L.Layer[] = [];
  for (const item of items) {
    if (item.type === 'flight') {
      flights.push(createFlight(item.airports));
    } else {
      const marker = createMarker([item.latitude, item.longitude], item.icon, {
        title: item.title.replace(/&#39;/g, "'"),
        href: `/${item.link}`,
      });
      markers.push({ type: item.type, marker });
      clusters.addLayer(marker);
    }
  }

  map.fitBounds(boundsOf(markers.map(({ marker }) => marker)));
  const flightLayer = L.layerGroup(flights).addTo(map);
  map.addLayer(clusters);

  // The buttons in the bottom left which show only one type of thing.
  const filterBar = document.getElementById('map-filter');
  if (!filterBar) return;
  let hidden: L.Marker[] = [];
  const showOnly = (type: string) => {
    clusters.addLayers(hidden);
    if (!map.hasLayer(flightLayer)) map.addLayer(flightLayer);
    hidden = type ? markers.filter((m) => m.type !== type).map(({ marker }) => marker) : [];
    if (type && type !== 'flight') map.removeLayer(flightLayer);
    clusters.removeLayers(hidden);
  };

  // Clicks on the buttons shouldn't also be handled by the map underneath them.
  L.DomEvent.disableClickPropagation(filterBar);
  filterBar.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    tooltip(link, { placement: 'right' });
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = link.dataset.filter ?? '';
      showOnly(type);
      filterBar.querySelector('a.active')?.classList.remove('active');
      if (type) link.classList.add('active');
    });
  });
}
