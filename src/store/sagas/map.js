import { call, put } from 'redux-saga/effects';

import { Creators as MapActions } from '~/store/ducks/map';
import { api, apiLogin } from '~/services/api';

export function* requestVehicleLocation(action) {
  try {
    const { token } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = yield call(apiLogin.get, '/location/getLastLocation', {
      headers,
    });
    yield put(MapActions.requestVehicleLocationSuccess(response.data));
  } catch (err) {
    yield put(MapActions.requestVehicleLocationFailure(err));
  }
}

export function* setMyLocation(action) {
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
    debugger;
    const response = yield call(
      apiLogin.post,
      '/location/inserUserLocation',
      JSON.stringify(vehicleLocationRto),
      { headers },
    );
    yield put(MapActions.setMyLocationSuccess(response.data));
  } catch (err) {
    yield put(MapActions.setMyLocationFailure(err));
  }
}
