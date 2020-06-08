import Immutable from 'seamless-immutable';

export const Types = {
  REGISTER_ADDRESS_REQUEST: 'address/REGISTER_ADDRESS_REQUEST',
  REGISTER_ADDRESS_SUCCESS: 'address/REGISTER_ADDRESS_SUCCESS',
  REGISTER_ADDRESS_FAILURE: 'address/REGISTER_ADDRESS_FAILURE',

  USER_DETAIL_REQUEST: 'address/USER_DETAIL_REQUEST',
  USER_DETAIL_SUCCESS: 'address/USER_DETAIL_SUCCESS',
  USER_DETAIL_FAILURE: 'address/USER_DETAIL_FAILURE',
};

const initialState = Immutable({
  loadingUserDetail: false,
  errorUserDetail: false,
  messageUserDetail: '',
  userDetail: {},
  loadingAddress: false,
  errorAddress :false,
  registered: false,
});

export const Creators = {
  registerAdress: (
    city,
    district,
    building,
    company,
    name,
    phone,
    email,
    addressDesciption,
    token,
  ) => ({
    type: Types.REGISTER_ADDRESS_REQUEST,
    payload: {
      city,
      district,
      building,
      company,
      name,
      phone,
      email,
      addressDesciption,
      token,
    },
  }),

  registerAdressSuccess: data => ({
    type: Types.REGISTER_ADDRESS_SUCCESS,
    payload: { data },
  }),

  registerAdressFailure: data => ({
    type: Types.REGISTER_ADDRESS_FAILURE,
    payload: { data },
  }),

  getUserDetail: token => ({
    type: Types.USER_DETAIL_REQUEST,
    payload: { token },
  }),

  getUserDetailSuccess: data => ({
    type: Types.USER_DETAIL_SUCCESS,
    payload: { data },
  }),

  getUserDetailFailure: data => ({
    type: Types.USER_DETAIL_FAILURE,
    payload: { data },
  }),
};

const adress = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.REGISTER_ADDRESS_REQUEST:
      return {
        ...state,
        registered: false,
        loadingAddress: true,
        errorAddress: false,
      };

    case Types.REGISTER_ADDRESS_SUCCESS:
      return {
        ...state,
        registered: true,
        errorAddress: false,
        loadingAddress: false,
      };

    case Types.REGISTER_ADDRESS_FAILURE:
      return {
        ...state,
        registered: false,
        loadingAddress: false,
        errorAddress: true,
        message: { payload },
      };

    case Types.USER_DETAIL_REQUEST:
      return {
        ...state,
        loadingUserDetail: true,
        registered: false,
        errorUserDetail: false,
      };

    case Types.USER_DETAIL_SUCCESS:
      return {
        ...state,
        userDetail: payload.data,
        errorUserDetail: false,
        loadingUserDetail: false,
      };

    case Types.USER_DETAIL_FAILURE:
      return {
        ...state,
        loadingUserDetail: false,
        errorUserDetail: true,
        message: { payload },
      };
    default:
      return state;
  }
};

export default adress;
