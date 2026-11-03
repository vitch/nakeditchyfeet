import type L from 'leaflet';
import { parseLatLng, throttle } from '../lib/dom';
import { createFlight, createMarker } from '../map/markers';
import type { SideMap } from '../map/side-map';

/**
 * The home page (and tag pages): a list of posts, photosets and flights. The side map shows
 * whichever items are currently scrolled into view.
 */
export function initHomeList(list: HTMLElement, sideMap: SideMap | undefined): void {
  const items = Array.from(list.children) as HTMLElement[];

  list.addEventListener('click', (e) => {
    const li = (e.target as Element).closest<HTMLElement>('li.has-link');
    const link = li?.querySelector('a');
    if (!li || !link || !list.contains(li)) return;
    e.preventDefault();
    if (link.target === '_blank') {
      window.open(link.href);
    } else {
      window.location.href = link.href;
    }
  });

  if (!sideMap) return;

  const markers = new WeakMap<HTMLElement, L.Layer | null>();
  const markerFor = (li: HTMLElement): L.Layer | null => {
    if (markers.has(li)) return markers.get(li)!;
    const iconClass = li.querySelector(':scope > .nif-icon')?.classList[1] ?? 'nif-icon-plane';
    let marker: L.Layer | null = null;
    if (iconClass === 'nif-icon-plane') {
      const airports = li.querySelector<HTMLElement>('div[data-airports]')?.dataset.airports;
      if (airports) marker = createFlight(airports, { associatedElement: li });
    } else {
      const latLng = parseLatLng(li.dataset.geo);
      const hasPage = ['nif-icon-book', 'nif-icon-info-circle', 'nif-icon-camera-retro'].includes(iconClass);
      if (latLng) {
        marker = createMarker(latLng, iconClass, {
          title: li.querySelector('h1')?.textContent?.replace(/[\t\n]/g, ''),
          associatedElement: li,
          href: hasPage ? li.querySelector('a')?.href : undefined,
        });
      }
    }
    markers.set(li, marker);
    return marker;
  };

  const updateMap = () => {
    const viewportHeight = window.innerHeight;
    const visible: L.Layer[] = [];
    items.forEach((li) => li.classList.remove('is-in-view'));
    for (const li of items) {
      const { top, bottom } = li.getBoundingClientRect();
      if (bottom < 0) continue;
      if (top > viewportHeight) break;
      li.classList.add('is-in-view');
      const marker = markerFor(li);
      if (marker) visible.push(marker);
    }
    sideMap.updateMarkers(visible);
  };

  sideMap.init({ preventZoom: true });
  sideMap.onResize(updateMap);
  const throttledUpdate = throttle(updateMap, 400, { leading: false });
  document.addEventListener('scroll', throttledUpdate, { passive: true });
  throttledUpdate();
}
