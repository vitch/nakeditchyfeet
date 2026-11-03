/**
 * Calls `fn` at most once every `wait` ms. The last call in a burst always runs (after the wait).
 * With `leading: false` the first call is delayed too, rather than running immediately.
 */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
  { leading = true } = {},
): (...args: A) => void {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: A;
  return (...args: A) => {
    const now = Date.now();
    if (!last && !leading) last = now;
    pendingArgs = args;
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = undefined;
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = leading ? Date.now() : 0;
        timer = undefined;
        fn(...pendingArgs);
      }, remaining);
    }
  };
}

/** The size of the viewport, excluding any scrollbars. */
export function viewportSize(): { width: number; height: number } {
  const { clientWidth, clientHeight } = document.documentElement;
  return { width: clientWidth, height: clientHeight };
}

/** Parses a `"lat, lng"` string (as found in our `data-geo` attributes). */
export function parseLatLng(geo: string | undefined | null): [number, number] | undefined {
  const [lat, lng] = (geo ?? '').split(',').map((n) => parseFloat(n));
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : undefined;
}

export function onHover(
  el: EventTarget,
  enter: () => void,
  leave: () => void,
  options?: AddEventListenerOptions,
): void {
  el.addEventListener('mouseenter', enter, options);
  el.addEventListener('mouseleave', leave, options);
}
