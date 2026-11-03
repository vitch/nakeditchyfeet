import L from 'leaflet';
import { throttle, viewportSize } from '../lib/dom';
import { hideAllTooltips } from '../lib/tooltip';
import { layerBounds } from './markers';
import { createTileLayer, TILES_MAX_ZOOM } from './tiles';

export interface SideMapOptions {
  /** A single marker to centre the map on. */
  marker?: L.Marker;
  /** Zoom level when showing a single `marker`. */
  zoom?: number;
  /** Markers to show, with the map zoomed to fit them. */
  markers?: L.Layer[];
  /** Make the map static (no dragging, zooming etc). */
  preventZoom?: boolean;
}

const FIT_BOUNDS_OPTIONS: L.FitBoundsOptions = { padding: [20, 20] };

export function boundsOf(layers: L.Layer[]): L.LatLngBounds {
  const bounds = L.latLngBounds([]);
  layers.forEach((layer) => bounds.extend(layerBounds(layer)));
  return bounds;
}

/**
 * The map which fills the right hand side of the page on wide screens (it's hidden by CSS on
 * narrower ones). It's only created once it's visible.
 */
export class SideMap {
  private readonly el: HTMLElement;
  private readonly siteContent: HTMLElement;
  private map?: L.Map;
  /** For a map showing `updateMarkers()` (rather than markers passed to `init()`). */
  private markerLayer?: L.LayerGroup;
  private pendingOptions?: SideMapOptions;
  private pendingMarkers?: L.Layer[];
  private readonly resizeListeners: Array<() => void> = [];

  static create(): SideMap | undefined {
    const el = document.getElementById('side-map');
    const siteContent = document.getElementById('site-content');
    return el && siteContent ? new SideMap(el, siteContent) : undefined;
  }

  private constructor(el: HTMLElement, siteContent: HTMLElement) {
    this.el = el;
    this.siteContent = siteContent;
    window.addEventListener('resize', throttle(() => this.handleResize(), 200, { leading: false }));
    this.handleResize();
  }

  private get isShown(): boolean {
    return getComputedStyle(this.el).display === 'block';
  }

  /** Called after the map is resized (and so its visible area might have changed). */
  onResize(listener: () => void): void {
    this.resizeListeners.push(listener);
  }

  init(options: SideMapOptions = {}): void {
    if (!this.isShown) {
      this.pendingOptions = options;
      return;
    }
    this.pendingOptions = undefined;
    this.handleResize();

    const { zoom = 6, marker, markers, preventZoom } = options;
    const mapOptions: L.MapOptions = {
      scrollWheelZoom: false,
      maxZoom: Math.min(TILES_MAX_ZOOM, 11),
    };
    if (preventZoom) {
      Object.assign(mapOptions, {
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        trackResize: false,
        keyboard: false,
        zoomControl: false,
      } satisfies L.MapOptions);
    }

    if (marker) {
      mapOptions.layers = [marker];
      mapOptions.center = marker.getLatLng();
      mapOptions.zoom = zoom;
    } else if (markers) {
      mapOptions.layers = markers;
    } else {
      this.markerLayer = L.layerGroup();
      mapOptions.layers = [this.markerLayer];
    }

    this.el.replaceChildren();
    this.map = L.map(this.el, mapOptions);
    this.map.on('movestart zoomstart', hideAllTooltips);
    createTileLayer().addTo(this.map);

    if (markers) {
      this.map.fitBounds(boundsOf(markers), FIT_BOUNDS_OPTIONS);
    }
    if (this.pendingMarkers) {
      this.updateMarkers(this.pendingMarkers);
      this.pendingMarkers = undefined;
    }
  }

  /** Replaces the markers on a map which was created without any (`init()` with no `marker(s)`). */
  updateMarkers(markers: L.Layer[]): void {
    if (!this.map || !this.markerLayer) {
      this.pendingMarkers = markers;
      return;
    }
    this.markerLayer.clearLayers();
    markers.forEach((marker) => this.markerLayer!.addLayer(marker));
    if (markers.length) {
      this.map.fitBounds(boundsOf(markers), FIT_BOUNDS_OPTIONS);
    }
  }

  private handleResize(): void {
    const content = this.siteContent;
    content.style.height = 'auto';
    const viewport = viewportSize();
    if (parseFloat(getComputedStyle(content).height) < viewport.height) {
      content.style.height = `${viewport.height}px`;
    }

    const left = content.offsetWidth + parseFloat(getComputedStyle(content).marginLeft);
    Object.assign(this.el.style, {
      height: `${viewport.height}px`,
      width: `${viewport.width - left}px`,
      left: `${left}px`,
    });

    if (!this.isShown) return;
    if (this.pendingOptions) {
      this.init(this.pendingOptions);
    }
    if (this.map) {
      this.map.invalidateSize(false);
      this.resizeListeners.forEach((listener) => listener());
    }
  }
}
