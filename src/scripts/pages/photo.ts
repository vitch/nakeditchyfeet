import { parseLatLng } from '../lib/dom';
import { tooltip } from '../lib/tooltip';
import { createMarker } from '../map/markers';
import type { SideMap } from '../map/side-map';

/** A single photo: the side map shows where it was taken. */
export function initPhoto(container: HTMLElement, sideMap: SideMap | undefined): void {
  container.querySelectorAll<HTMLElement>('nav a').forEach((link) => tooltip(link, { placement: 'bottom' }));

  const img = container.querySelector('img');
  // The page height depends on the image, so re-layout once it's loaded.
  img?.addEventListener('load', () => window.dispatchEvent(new Event('resize')));

  const latLng = parseLatLng(container.dataset.geo);
  if (!sideMap || !latLng) return;
  sideMap.init({
    marker: createMarker(latLng, 'camera-retro', { title: img?.title, hoverable: false }),
    zoom: 8,
  });
}
