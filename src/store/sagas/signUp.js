import { call, put } from 'redux-saga/effects';

import { Creators as SignUpActions } from '~/store/ducks/signUp';
import { api, apiLogin } from '~/services/api';

export function* signUpRequest(action) {
  try {
    console.log(action);
    const {
      name, email, password, phone,
    } = action.payload;
    const signUp = {
      email,
      password,
      phone,
      name,
    };

    const headers = {
      'Content-Type': 'application/json',
    };
    const response = yield call(
      apiLogin.post,
      '/auth/signup',
      JSON.stringify(signUp),
      { headers },
    );
    yield put(SignUpActions.signUpSuccess(response.data));
  } catch (err) {
    yield put(SignUpActions.signUpFailure(err));
  }
}
