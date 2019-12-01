import { combineReducers } from 'redux';

import nearbyRestaurants from './nearby-restaurants';
import searchRestaurants from './search-restaurants';
import restaurant from './restaurant';
import events from './events';
import dish from './dish';
import home from './home';
import login from './login';
import signUp from './signUp';
import coffee from './coffee';
import adress from './adress';
import admin from './admin';
import map from './map';

export default combineReducers({
  nearbyRestaurants,
  searchRestaurants,
  restaurant,
  events,
  dish,
  home,
  login,
  signUp,
  coffee,
  adress,
  admin,
  map,
});
