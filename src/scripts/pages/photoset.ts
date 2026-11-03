import { parseLatLng, throttle } from '../lib/dom';
import { createMarker } from '../map/markers';
import type { SideMap } from '../map/side-map';

const MARGIN = 5;
const MAX_HEIGHT = 200;

interface Photo {
  img: HTMLImageElement;
  width: number;
  height: number;
  scaledWidth: number;
}

/**
 * A photoset: the thumbnails are laid out in justified rows (each row filling the width), and the
 * side map shows where they were all taken.
 */
export function initPhotoset(list: HTMLElement, sideMap: SideMap | undefined): void {
  const photos: Photo[] = Array.from(list.querySelectorAll('img'), (img) => ({
    img,
    width: parseInt(img.dataset.w ?? '', 10),
    height: parseInt(img.dataset.h ?? '', 10),
    scaledWidth: 0,
  }));

  let laidOutWidth: number | undefined;
  const layout = () => {
    const style = getComputedStyle(list);
    const availableWidth = list.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - MARGIN;
    if (availableWidth === laidOutWidth) return;
    laidOutWidth = availableWidth;

    let row: Photo[] = [];
    let rowWidth = 0;
    for (const photo of photos) {
      photo.scaledWidth = (MAX_HEIGHT / photo.height) * photo.width;
      row.push(photo);
      rowWidth += photo.scaledWidth + MARGIN;
      if (rowWidth > availableWidth) {
        sizeRow(row, rowWidth, availableWidth);
        row = [];
        rowWidth = 0;
      }
    }
    // The last row isn't stretched to fill the width.
    row.forEach(({ img }) => {
      img.style.width = '';
      img.style.height = `${MAX_HEIGHT}px`;
    });
  };
  window.addEventListener('resize', throttle(layout, 200));
  // Also lets the side map re-measure the page now the photos have been sized.
  window.dispatchEvent(new Event('resize'));

  if (!sideMap) return;
  const markers = photos.flatMap(({ img }) => {
    const latLng = parseLatLng(img.dataset.geo);
    if (!latLng) return [];
    return createMarker(latLng, 'camera-retro', {
      title: img.title,
      associatedElement: img,
      href: img.closest('a')?.href,
    });
  });
  sideMap.init({ markers });
}

/** Scales a row of photos so that they exactly fill `availableWidth`. */
function sizeRow(row: Photo[], rowWidth: number, availableWidth: number): void {
  const ratio = availableWidth / rowWidth;
  const height = Math.round(ratio * MAX_HEIGHT);
  const widths = row.map((photo) => Math.round(photo.scaledWidth * ratio));

  // Clean up rounding errors so everything lines up perfectly...
  let widthDiff = availableWidth - widths.reduce((a, b) => a + b, 0) - row.length * MARGIN;
  const step = widthDiff < 0 ? 1 : -1;
  widthDiff = Math.abs(widthDiff);
  for (let i = 0; widthDiff-- > 0; i = (i + 1) % widths.length) {
    widths[i] -= step;
  }

  // Apply the sizes at the end to avoid layout thrashing...
  row.forEach(({ img }, i) => {
    img.style.width = `${widths[i]}px`;
    img.style.height = `${height}px`;
  });
}
