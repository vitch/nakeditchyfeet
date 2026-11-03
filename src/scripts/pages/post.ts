import { parseLatLng } from '../lib/dom';
import { createMarker } from '../map/markers';
import type { SideMap } from '../map/side-map';

/** A blog post or travel tip: the side map shows where it is. */
export function initPost(post: HTMLElement, sideMap: SideMap | undefined): void {
  const latLng = parseLatLng(post.dataset.geo);
  if (!sideMap || !latLng) return;
  sideMap.init({
    marker: createMarker(latLng, 'book', {
      title: post.querySelector(':scope > h1')?.textContent ?? undefined,
      hoverable: false,
    }),
  });
}
