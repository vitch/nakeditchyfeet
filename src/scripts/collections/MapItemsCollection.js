import Backbone from 'backbone';
import MapItemModel from '../models/MapItemModel.js';

export default Backbone.Collection.extend(
  {
    model: MapItemModel,
    url: '/map-data.json'
  }
);
