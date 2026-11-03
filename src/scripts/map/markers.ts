import L from 'leaflet';
import { onHover } from '../lib/dom';
import { tooltip, hideAllTooltips, type Tooltip } from '../lib/tooltip';

export interface MarkerOptions {
  /** Shown in a tooltip when the marker is hovered (may contain HTML). */
  title?: string;
  /** Highlight the marker (and `associatedElement`) when it's hovered. Defaults to true. */
  hoverable?: boolean;
  /** An element on the page (e.g. an item in a list) which is highlighted along with the marker. */
  associatedElement?: HTMLElement;
  /** Go here when the marker is clicked. */
  href?: string;
  zIndexOffset?: number;
}

/** A pin shaped marker (styled by `.map-marker` in styles.less) containing one of our icons. */
class PinIcon extends L.Icon<L.BaseIconOptions & { icon: string }> {
  override createIcon(): HTMLElement {
    const icon = this.options.icon;
    const div = document.createElement('div');
    div.className = 'map-marker';
    const span = document.createElement('span');
    span.className = `nif-icon ${icon.startsWith('nif-icon-') ? icon : `nif-icon-${icon}`}`;
    div.append(span);
    return div;
  }

  override createShadow(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'map-marker-shadow';
    return div;
  }
}

function enhanceMarker(marker: L.Marker, options: MarkerOptions): L.Marker {
  const { hoverable = true, associatedElement, href } = options;
  // Hacky way to push the tooltips out to a decent width...
  const title = options.title && options.title.slice(0, 20).replace(/ /g, '&nbsp;') + options.title.slice(20);
  const zIndexOffset = marker.options.zIndexOffset ?? 0;
  let tip: Tooltip | undefined;
  let listeners: AbortController | undefined;

  const highlight = (on: boolean) => {
    marker.getElement()?.classList.toggle('marker-active', on);
    associatedElement?.classList.toggle('marker-active', on);
    marker.setZIndexOffset(on ? zIndexOffset + (marker.options.riseOffset ?? 250) : zIndexOffset);
  };

  // The marker's element is created each time it's added to the map (e.g. as clusters split up).
  marker.on('add', () => {
    const icon = marker.getElement()!;
    listeners = new AbortController();
    const { signal } = listeners;
    if (title) {
      tip = tooltip(icon, { title, html: true, placement: 'auto' });
    }
    if (hoverable) {
      onHover(icon, () => highlight(true), () => highlight(false), { signal });
      if (associatedElement) {
        onHover(
          associatedElement,
          () => {
            highlight(true);
            tip?.show();
          },
          () => {
            highlight(false);
            hideAllTooltips();
          },
          { signal },
        );
      }
    }
  });
  marker.on('remove', () => {
    listeners?.abort();
    tip?.destroy();
    tip = undefined;
  });

  if (href) {
    marker.on('click', () => {
      window.location.href = href;
    });
  }
  return marker;
}

export function createMarker(latLng: L.LatLngExpression, icon: string, options: MarkerOptions = {}): L.Marker {
  return enhanceMarker(
    L.marker(latLng, { icon: new PinIcon({ icon }), zIndexOffset: options.zIndexOffset }),
    options,
  );
}

const airportIcon = L.divIcon({ className: 'map-marker-airport', iconSize: [4, 4], html: '' });

/** The angle (in degrees, clockwise from east) of the line from `a` to `b` on the (Mercator) map. */
function angleOnMap(a: L.LatLng, b: L.LatLng): number {
  const p1 = L.CRS.EPSG3857.latLngToPoint(a, 0);
  const p2 = L.CRS.EPSG3857.latLngToPoint(b, 0);
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

/**
 * A flight (or series of connecting flights): a dashed line between the airports with a small marker
 * on each airport and a plane in the middle of each leg.
 *
 * @param airports As written into the page / map-data.json, e.g. `LHR|51.47,-0.45|London||GRU|-23.43,-46.47|Sao Paulo`
 */
export function createFlight(airports: string, options: { associatedElement?: HTMLElement } = {}): L.FeatureGroup {
  const stops = airports.split('||').map((airport) => {
    const [, latLng, name] = airport.split('|');
    const [lat, lng] = latLng.split(',').map((n) => parseFloat(n));
    return { latLng: L.latLng(lat, lng), name };
  });

  const layers: L.Layer[] = stops.map(({ latLng, name }) =>
    enhanceMarker(L.marker(latLng, { icon: airportIcon, zIndexOffset: -1000 }), { title: name }),
  );

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i].latLng;
    const to = stops[i + 1].latLng;
    const rotation = Math.round(angleOnMap(from, to) + 45);
    const planeIcon = L.divIcon({
      className: 'map-marker-airplane',
      iconSize: [10, 10],
      html: `<span class="nif-icon nif-icon-plane" style="transform: rotate(${rotation}deg)"></span>`,
    });
    layers.push(
      enhanceMarker(L.marker(L.latLngBounds(from, to).getCenter(), { icon: planeIcon, zIndexOffset: -1000 }), {
        title: `${stops[i].name} - ${stops[i + 1].name}`,
      }),
    );
  }

  const line = L.polyline(
    stops.map((stop) => stop.latLng),
    { color: '#000', opacity: 0.5, dashArray: '5, 5, 1, 5', weight: 1 },
  );
  layers.push(line);

  const group = L.featureGroup(layers);

  const { associatedElement } = options;
  if (associatedElement) {
    const highlight = (on: boolean) => {
      line.setStyle(on ? { color: '#F16522', weight: 3 } : { color: '#000', weight: 1 });
      associatedElement.classList.toggle('marker-active', on);
    };
    onHover(associatedElement, () => highlight(true), () => highlight(false));
    group.on('mouseover', () => highlight(true));
    group.on('mouseout', () => highlight(false));
  }
  return group;
}

/** Something which can be passed to `map.fitBounds()` to include this layer. */
export function layerBounds(layer: L.Layer): L.LatLngBounds | L.LatLng {
  if (layer instanceof L.FeatureGroup) return layer.getBounds();
  return (layer as L.Marker).getLatLng();
}
