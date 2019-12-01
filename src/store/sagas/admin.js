import { call, put } from 'redux-saga/effects';

import { Creators as AdminActions } from '~/store/ducks/admin';
import { api, apiLogin } from '~/services/api';

export function* requestAllOrder(action) {
  try {
    const { token } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = yield call(apiLogin.get, '/coffee/getNewOrders', {
      headers,
    });
    yield put(AdminActions.requestAllOrderSuccess(response.data));
  } catch (err) {
    yield put(AdminActions.requestAllOrderFailure(err));
  }
}

export function* setLocation(action) {
  try {
    const { latitude, longitude, data } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data}`,
    };
    const vehicleLocationRto = {
      latitude,
      longitude,
    };

    const response = yield call(
      apiLogin.post,
      '/location/insertLocation',
      JSON.stringify(vehicleLocationRto),
      { headers },
    );
    yield put(AdminActions.setLocationSuccess(response.data));
  } catch (err) {
    yield put(AdminActions.setLocationFailure(err));
  }
}

export function* updateOrderStatus(action) {
  try {
    const { orderUid, status, data } = action.payload;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data}`,
    };
    const updateOrderStatusRequest = {
      orderUid,
      status,
    };

    const response = yield call(
      apiLogin.post,
      '/coffee/updateOrderStatus',
      JSON.stringify(updateOrderStatusRequest),
      { headers },
    );
    yield put(AdminActions.updateOrderStatusSuccess(response.data));
  } catch (err) {
    yield put(AdminActions.updateOrderStatusFailure(err));
  }
}

export function* closeOrder(action) {
  try {
    const { data } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data}`,
    };

    const response = yield call(apiLogin.get, '/util/closeOrder', { headers });
    debugger;
    yield put(AdminActions.closeOrderSuccess(response.data));
  } catch (err) {
    yield put(AdminActions.closeOrderFailure(err));
  }
}

export function* isOrderClosed(action) {
  try {
    const { data } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data}`,
    };

    const response = yield call(apiLogin.get, '/util/isOrderClosed', {
      headers,
    });
    yield put(AdminActions.isOrderClosedSuccess(response.data));
  } catch (err) {
    yield put(AdminActions.isOrderClosedFailure(err));
  }
}

export function* openOrder(action) {
  try {
    const { data } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data}`,
    };

    const response = yield call(apiLogin.get, '/util/openOrder', { headers });
    debugger;
    yield put(AdminActions.openOrderSuccess(response.data));
  } catch (err) {
    yield put(AdminActions.openOrderFailure(err));
  }
}
