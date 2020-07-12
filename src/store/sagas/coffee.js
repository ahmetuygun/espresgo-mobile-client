import { call, put } from 'redux-saga/effects';

import { Creators as CoffeeActions } from '~/store/ducks/coffee';
import { api, apiLogin } from '~/services/api';

export function* requestCoffeeDetail(action) {
  try {
    const { id } = action.payload;

    const response = yield call(apiLogin.post, `/coffee/getCoffeeDetail/${id}`);
    yield put(CoffeeActions.requestCoffeeDetailSuccess(response.data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.requestCoffeeDetailFailure());
  }
}

export function* requestCoffee() {
  try {
    const response = yield call(apiLogin.post, '/coffee/coffeeSummaryList');
    yield put(CoffeeActions.requestCoffeeSuccess(response.data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.requestCoffeeFailure());
  }
}

export function* getHistory(action) {
  try {
    const { token } = action.payload;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    debugger;
    const response = yield call(apiLogin.get, '/coffee/getOrders', { headers });
    yield put(CoffeeActions.requestHistorySuccess(response.data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.requestHistoryFailure());
  }
}

export function* orderSingle(action) {
  try {
    const { data } = action.payload;
    yield put(CoffeeActions.orderSingleSuccess(data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.orderSingleFailure());
  }
}

export function* removeOrderSingle(action) {
  try {
    const { data } = action.payload;
    yield put(CoffeeActions.removeOrderSingleSuccess(data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.removeOrderSingleFailure());
  }
}

export function* orderCoffee(action) {
  try {
    const { orders, token, campaignCode } = action.payload;
    const order = {
      orders,
      campaignCode
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = yield call(
      apiLogin.post,
      '/coffee/order',
      JSON.stringify(order),
      { headers },
    );
    yield put(CoffeeActions.orderCoffeeSuccess(response.data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.orderCoffeeFailure(err));
  }
}

export function* applyCampaign(action) {
  try {
    const { orders, token, code } = action.payload;
    const campaign = {
      orders,
      campaignCode: code
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = yield call(
      apiLogin.post,
      '/coffee/applyCampaign',
      JSON.stringify(campaign),
      { headers },
    );
    yield put(CoffeeActions.applyCampaignSuccess(response.data));
   } catch (err) {
    console.log("error>"+err)
    yield put(CoffeeActions.applyCampaignFailure(err));
  }
}
