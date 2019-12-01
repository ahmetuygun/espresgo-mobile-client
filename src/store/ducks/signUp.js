import Immutable from 'seamless-immutable';

export const Types = {
  GET_SIGNUP_REQUEST: 'SignUp/GET_SIGNUP_REQUEST',
  GET_SIGNUP_SUCCESS: 'SignUp/GET_SIGNUP_SUCCESS',
  GET_SIGNUP_FAILURE: 'SignUp/GET_SIGNUP_FAILURE',
};

const initialState = Immutable({
  loading: false,
  error: false,
  registered: false,
  message: {},
});

export const Creators = {
  signUpRequest: (name, email, password, phone) => ({
    type: Types.GET_SIGNUP_REQUEST,
    payload: {
      name,
      email,
      password,
      phone,
    },
  }),

  signUpSuccess: data => ({
    type: Types.GET_SIGNUP_SUCCESS,
    payload: { data },
  }),

  signUpFailure: err => ({
    type: Types.GET_SIGNUP_FAILURE,
    payload: { err },
  }),
};

const signUp = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.GET_SIGNUP_REQUEST:
      return {
        ...state,
        registered: false,
        loading: true,
        error: false,
      };

    case Types.GET_SIGNUP_SUCCESS:
      return {
        ...state,
        registered: true,
        error: false,
        loading: false,
        message: { payload },
      };

    case Types.GET_SIGNUP_FAILURE:
      return {
        ...state,
        registered: false,
        loading: false,
        error: true,
        message: { payload },
      };
    default:
      return state;
  }
};

export default signUp;
