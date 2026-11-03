import { tooltip } from './lib/tooltip';
import { SideMap } from './map/side-map';
import { initHomeList } from './pages/home';
import { initPhoto } from './pages/photo';
import { initPhotoset } from './pages/photoset';
import { initPost } from './pages/post';
import { initSideNav } from './pages/side-nav';

const byId = (id: string) => document.getElementById(id);

document.querySelectorAll<HTMLElement>('.tt-trigger').forEach((el) => tooltip(el));

const header = byId('site-header');
const siteContent = byId('site-content');
if (header && siteContent) initSideNav(header, siteContent);

// Each page has (at most) one of these, which decides what the side map shows.
const sideMap = SideMap.create();
const homeList = byId('home-list');
const post = byId('post');
const photo = byId('fullsize-photo');
const photoset = byId('photoset');
const map = byId('map');

if (homeList) initHomeList(homeList, sideMap);
if (post) initPost(post, sideMap);
if (photo) initPhoto(photo, sideMap);
if (photoset) initPhotoset(photoset, sideMap);
// Only the map page needs marker clustering, so load that separately.
if (map) void import('./pages/map').then(({ initMapPage }) => initMapPage(map));
