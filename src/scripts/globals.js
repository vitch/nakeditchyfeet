// Some of the libraries we depend on (Bootstrap's tooltip plugin and Leaflet.markercluster)
// are old-school scripts which expect jQuery / Leaflet to be available as globals, so expose
// them before those plugins are imported (see nif.js).
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import L from 'leaflet';

// Backbone's CommonJS build doesn't pick up jQuery automatically.
Backbone.$ = $;

window.$ = window.jQuery = $;
window._ = _;
window.Backbone = Backbone;
window.L = L;
