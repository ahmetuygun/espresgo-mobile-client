import { AsyncStorage } from 'react-native';
import { call, put } from 'redux-saga/effects';
import { Creators as LoginActions } from '~/store/ducks/login';
import { api, apiLogin } from '~/services/api';

export function* loginRequest(action) {
  try {
    console.log(action);
    const { user, password } = action.payload;
    const login = {
      usernameOrEmail: user,
      password,
    };

    const headers = {
      'Content-Type': 'application/json',
    };
    const response = yield call(
      apiLogin.post,
      '/auth/signin',
      JSON.stringify(login),
      { headers },
    );

    AsyncStorage.setItem('accessToken', response.data.accessToken);
    yield put(LoginActions.loginSuccess(response.data));
  } catch (err) {
    yield put(LoginActions.loginFailure(err));
  }
}
