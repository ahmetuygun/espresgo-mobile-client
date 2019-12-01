import { call, put } from 'redux-saga/effects';

import { Creators as AdressActions } from '~/store/ducks/adress';
import { api, apiLogin } from '~/services/api';

export function* registerAdress(action) {
  try {
    const {
      city,
      district,
      building,
      company,
      name,
      phone,
      email,
      addressDesciption,
      token,
    } = action.payload;
    const address = {
      city_id: city,
      district_id: district,
      building_id: building,
      company_id: company,
      name,
      phone,
      addressDesciption,
      email,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = yield call(
      apiLogin.post,
      '/address',
      JSON.stringify(address),
      { headers },
    );

    yield put(AdressActions.registerAdressSuccess(response.data));
  } catch (err) {
    yield put(AdressActions.registerAdressFailure(err));
  }
}

export function* getUserDetail(action) {
  try {
    const { token } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = yield call(apiLogin.get, '/user/me', { headers });

    yield put(AdressActions.getUserDetailSuccess(response.data));
  } catch (err) {
    yield put(AdressActions.getUserDetailFailure(err));
  }
}
