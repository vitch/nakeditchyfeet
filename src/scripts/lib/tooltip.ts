/**
 * A small replacement for Bootstrap 3's jQuery tooltip plugin. It renders the same markup, so the
 * styles from `bootstrap/less/tooltip.less` still apply:
 *
 *   <div class="tooltip top in"><div class="tooltip-arrow"></div><div class="tooltip-inner">…</div></div>
 *
 * Like Bootstrap (without a `container`), the tooltip is inserted straight after the element it
 * belongs to, so it inherits the element's font (e.g. Leaflet's font for map markers).
 */

type Side = 'top' | 'bottom' | 'left' | 'right';
export type Placement = Side | 'auto';

export interface TooltipOptions {
  /** Defaults to the element's `title` attribute, which is removed so the browser's own tooltip doesn't show too. */
  title?: string;
  /** Treat the title as HTML rather than text. */
  html?: boolean;
  /** `auto` shows the tooltip above the element, or below if there isn't room above. */
  placement?: Placement;
}

export interface Tooltip {
  show(): void;
  hide(): void;
  destroy(): void;
}

const openTooltips = new Set<HTMLElement>();

/** Removes every visible tooltip (e.g. when a map starts moving, as they'd be left behind). */
export function hideAllTooltips(): void {
  openTooltips.forEach((tip) => tip.remove());
  openTooltips.clear();
}

export function tooltip(el: HTMLElement, options: TooltipOptions = {}): Tooltip {
  const title = options.title ?? el.getAttribute('title') ?? '';
  el.removeAttribute('title');
  // Icon-only links would otherwise lose their accessible name along with the title.
  if (title && !options.html && !el.textContent?.trim() && !el.hasAttribute('aria-label')) {
    el.setAttribute('aria-label', title);
  }
  const placement = options.placement ?? 'top';
  let tip: HTMLElement | undefined;

  const hide = () => {
    if (tip) {
      tip.remove();
      openTooltips.delete(tip);
      tip = undefined;
    }
  };

  const show = () => {
    hide();
    if (!title || !el.isConnected) return;

    tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.setAttribute('role', 'tooltip');
    const inner = document.createElement('div');
    inner.className = 'tooltip-inner';
    inner[options.html ? 'innerHTML' : 'textContent'] = title;
    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    tip.append(arrow, inner);

    const target = el.getBoundingClientRect();
    let side: Side = placement === 'auto' ? 'top' : placement;
    tip.classList.add(side);
    Object.assign(tip.style, { top: '0', left: '0', display: 'block' });
    el.after(tip);
    openTooltips.add(tip);

    if (placement === 'auto') {
      // Flip below the element if there isn't room above it (within the map, if it's on one).
      const bounds = el.closest('.leaflet-container')?.getBoundingClientRect();
      if (target.top - tip.offsetHeight < Math.max(0, bounds?.top ?? 0)) {
        tip.classList.replace('top', 'bottom');
        side = 'bottom';
      }
    }

    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    const centreX = target.left + target.width / 2 - width / 2;
    const centreY = target.top + target.height / 2 - height / 2;
    const position = {
      top: { left: centreX, top: target.top - height },
      bottom: { left: centreX, top: target.bottom },
      left: { left: target.left - width, top: centreY },
      right: { left: target.right, top: centreY },
    }[side];

    // The tooltip is currently at (0, 0) within its offset parent; move it from there (keeping
    // the margins Bootstrap's CSS gives each side).
    const origin = tip.getBoundingClientRect();
    const style = getComputedStyle(tip);
    tip.style.left = `${Math.round(position.left - origin.left + parseFloat(style.marginLeft))}px`;
    tip.style.top = `${Math.round(position.top - origin.top + parseFloat(style.marginTop))}px`;
    tip.classList.add('in');
  };

  const controller = new AbortController();
  const { signal } = controller;
  el.addEventListener('mouseenter', show, { signal });
  el.addEventListener('focus', show, { signal });
  el.addEventListener('mouseleave', hide, { signal });
  el.addEventListener('blur', hide, { signal });

  return {
    show,
    hide,
    destroy() {
      hide();
      controller.abort();
    },
  };
}
