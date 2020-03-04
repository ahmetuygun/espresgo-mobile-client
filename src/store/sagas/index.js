import { all, takeLatest } from 'redux-saga/effects';

import { Types as NearbyRestaurantsTypes } from '~/store/ducks/nearby-restaurants';
import { Types as SearchRestaurantsTypes } from '~/store/ducks/search-restaurants';
import { Types as RestaurantTypes } from '~/store/ducks/restaurant';
import { Types as EventTypes } from '~/store/ducks/events';
import { Types as HomeTypes } from '~/store/ducks/home';
import { Types as DishTypes } from '~/store/ducks/dish';
import { Types as LoginType } from '~/store/ducks/login';
import { Types as SingUpType } from '~/store/ducks/signUp';
import { Types as CoffeeType } from '~/store/ducks/coffee';
import { Types as AddressType } from '~/store/ducks/adress';
import { Types as AdminTypes } from '~/store/ducks/admin';
import { Types as MapTypes } from '~/store/ducks/map';

import { requestNearbyRestaurants } from './nearby-restaurants';
import { requestSearchRestaurants } from './search-restaurants';
import { requestAllEvents, requestEventDetails } from './events';
import { requestRestaurantDetail } from './restaurant';
import { homeRequest } from './home';
import { requestAllDishes, requestDishDetail } from './dish';
import { loginRequest } from './login';
import { signUpRequest } from './signUp';
import {
  getHistory,
  orderCoffee,
  orderSingle,
  removeOrderSingle,
  requestCoffee,
  requestCoffeeDetail,
  applyCampaign
} from './coffee';
import { getUserDetail, registerAdress } from './adress';
import {
  closeOrder,
  getOrderByUid,
  isOrderClosed,
  openOrder,
  requestAllOrder,
  setLocation,
  updateOrderStatus,
} from './admin';
import { requestVehicleLocation, setMyLocation } from './map';

export default function* rootSaga() {
  return yield all([
    takeLatest(
      NearbyRestaurantsTypes.GET_NEAR_BY_RESTAURANTS_REQUEST,
      requestNearbyRestaurants,
    ),
    takeLatest(
      SearchRestaurantsTypes.SEARCH_RESTAURANTS_REQUEST,
      requestSearchRestaurants,
    ),
    takeLatest(RestaurantTypes.GET_DETAIL_REQUEST, requestRestaurantDetail),
    takeLatest(EventTypes.GET_EVENT_DETAILS_REQUEST, requestEventDetails),
    takeLatest(EventTypes.GET_ALL_EVENTS_REQUEST, requestAllEvents),
    takeLatest(HomeTypes.GET_REQUEST, homeRequest),
    takeLatest(DishTypes.GET_DISH_DETAIL_REQUEST, requestDishDetail),
    takeLatest(DishTypes.GET_ALL_DISHES_REQUEST, requestAllDishes),
    takeLatest(DishTypes.GET_ALL_DISHES_REQUEST, requestAllDishes),
    takeLatest(LoginType.GET_LOGIN_REQUEST, loginRequest),
    takeLatest(SingUpType.GET_SIGNUP_REQUEST, signUpRequest),
    takeLatest(CoffeeType.GET_COFFEE_REQUEST, requestCoffee),
    takeLatest(CoffeeType.GET_COFFEE_DETAIL_REQUEST, requestCoffeeDetail),
    takeLatest(CoffeeType.ORDER_COFFEE_REQUEST, orderCoffee),
    takeLatest(AddressType.REGISTER_ADDRESS_REQUEST, registerAdress),
    takeLatest(AddressType.USER_DETAIL_REQUEST, getUserDetail),
    takeLatest(CoffeeType.ORDER_SINGLE_REQUEST, orderSingle),
    takeLatest(CoffeeType.REMOVE_ORDER_SINGLE_REQUEST, removeOrderSingle),
    takeLatest(CoffeeType.ORDER_HISTORY_REQUEST, getHistory),
    takeLatest(AdminTypes.ALL_ORDER_REQUEST, requestAllOrder),
    takeLatest(AdminTypes.SET_LOCATION_REQUEST, setLocation),
    takeLatest(AdminTypes.CLOSE_ORDER_REQUEST, closeOrder),
    takeLatest(AdminTypes.IS_ORDER_CLOSE_REQUEST, isOrderClosed),
    takeLatest(AdminTypes.OPEN_ORDER_REQUEST, openOrder),
    takeLatest(AdminTypes.UPDATE_ORDER_STATUS_REQUEST, updateOrderStatus),
    takeLatest(AdminTypes.GET_ORDER_BY_UID_REQUEST, getOrderByUid),
    takeLatest(CoffeeType.APPLY_CAMPAIGN_REQUEST, applyCampaign),
    takeLatest(MapTypes.SET_MY_LOCATION_REQUEST, setMyLocation),
    takeLatest(MapTypes.VEHICLE_LOCATION_REQUEST, requestVehicleLocation),
  ]);
}
