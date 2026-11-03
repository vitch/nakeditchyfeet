/** The navigation bar down the left hand side, which slides open when hovered. */
export function initSideNav(header: HTMLElement, siteContent: HTMLElement): void {
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  header.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    siteContent.style.width = `${siteContent.offsetWidth}px`;
    siteContent.classList.add('sidenav-hover');
  });
  header.addEventListener('mouseleave', () => {
    siteContent.classList.remove('sidenav-hover');
    closeTimer = setTimeout(() => {
      siteContent.style.width = '';
    }, 300);
  });

  // The little arrow pointing at the current section.
  const activeLink = header.querySelector<HTMLElement>('a.active');
  if (activeLink) {
    const marker = document.createElement('span');
    marker.className = 'active-marker';
    marker.style.top = `${activeLink.offsetTop - parseFloat(getComputedStyle(activeLink).marginTop) + 11}px`;
    siteContent.prepend(marker);
  }
}
