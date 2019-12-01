import Immutable from 'seamless-immutable';

export const Types = {
  GET_LOGIN_REQUEST: 'login/GET_LOGIN_REQUEST',
  GET_LOGIN_SUCCESS: 'login/GET_LOGIN_SUCCESS',
  GET_LOGIN_FAILURE: 'login/GET_LOGIN_FAILURE',
};

const initialState = Immutable({
  loading: false,
  error: false,
  authenticated: false,
  message: '',
});

export const Creators = {
  loginRequest: (user, password) => ({
    type: Types.GET_LOGIN_REQUEST,
    payload: { user, password },
  }),

  loginSuccess: data => ({
    type: Types.GET_LOGIN_SUCCESS,
    payload: { data },
  }),

  loginFailure: data => ({
    type: Types.GET_LOGIN_FAILURE,
    payload: { data },
  }),
};

const login = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.GET_LOGIN_REQUEST:
      return {
        ...state,
        authenticated: false,
        loading: true,
        error: false,
      };

    case Types.GET_LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        error: false,
        loading: false,
      };

    case Types.GET_LOGIN_FAILURE:
      return {
        ...state,
        authenticated: false,
        loading: false,
        error: true,
        message: { payload },
      };
    default:
      return state;
  }
};

export default login;
