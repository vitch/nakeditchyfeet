import { parseLatLng } from '../lib/dom';
import { tooltip } from '../lib/tooltip';
import { createMarker } from '../map/markers';
import type { SideMap } from '../map/side-map';

/** A single photo: the side map shows where it was taken. */
export function initPhoto(container: HTMLElement, sideMap: SideMap | undefined): void {
  container.querySelectorAll<HTMLElement>('nav a').forEach((link) => tooltip(link, { placement: 'bottom' }));

  // The left / right arrow keys go to the previous / next photo, and escape goes back to the photoset.
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const target = e.target as HTMLElement;
    if (target.isContentEditable || target.closest('input, textarea, select')) return;
    const rel = { ArrowRight: 'next', ArrowLeft: 'prev', Escape: 'up' }[e.key];
    const link = rel && container.querySelector<HTMLAnchorElement>(`nav a[rel="${rel}"]`);
    if (link) {
      e.preventDefault();
      window.location.href = link.href;
    }
  });

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
