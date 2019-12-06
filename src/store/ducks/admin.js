export const Types = {
  ALL_ORDER_REQUEST: 'admin/ALL_ORDER_REQUEST',
  ALL_ORDER_SUCCESS: 'admin/ALL_ORDER_SUCCESS',
  ALL_ORDER_FAILURE: 'admin/ALL_ORDER_FAILURE',

  SET_LOCATION_REQUEST: 'admin/SET_LOCATION_REQUEST',
  SET_LOCATION_SUCCESS: 'admin/SET_LOCATION_SUCCESS',
  SET_LOCATION_FAIL: 'admin/SET_LOCATION_SUCCESS',

  CLOSE_ORDER_REQUEST: 'admin/CLOSE_ORDER_REQUEST',
  CLOSE_ORDER_SUCCESS: 'admin/CLOSE_ORDER_SUCCESS',
  CLOSE_ORDER_FAIL: 'admin/CLOSE_ORDER_FAIL',

  OPEN_ORDER_REQUEST: 'admin/OPEN_ORDER_REQUEST',
  OPEN_ORDER_SUCCESS: 'admin/OPEN_ORDER_SUCCESS',
  OPEN_ORDER_FAIL: 'admin/OPEN_ORDER_FAIL',

  IS_ORDER_CLOSE_REQUEST: 'admin/IS_ORDER_CLOSE_REQUEST',
  IS_ORDER_CLOSE_SUCCESS: 'admin/IS_ORDER_CLOSE_SUCCESS',
  IS_ORDER_CLOSE_FAIL: 'admin/IS_ORDER_CLOSE_FAIL',

  UPDATE_ORDER_STATUS_REQUEST: 'admin/UPDATE_ORDER_STATUS_REQUEST',
  UPDATE_ORDER_STATUS_REQUEST_SUCCESS:
    'admin/UPDATE_ORDER_STATUS_REQUEST_SUCCESS',
  UPDATE_ORDER_STATUS_REQUEST_FAIL: 'admin/UPDATE_ORDER_STATUS_REQUEST_FAIL',

  GET_ORDER_BY_UID_REQUEST: 'admin/GET_ORDER_BY_UID_REQUEST',
  GET_ORDER_BY_UID_SUCCESS: 'admin/GET_ORDER_BY_UID_SUCCESS',
  GET_ORDER_BY_UID_FAIL: 'admin/GET_ORDER_BY_UID_FAIL',
};

const initialState = {
  loading: false,
  error: false,
  allOrder: [],
  message: {},
  orderClosed: false,
  orderDetail: [],
};

export const Creators = {
  requestAllOrder: token => ({
    type: Types.ALL_ORDER_REQUEST,
    payload: { token },
  }),

  requestAllOrderSuccess: data => ({
    type: Types.ALL_ORDER_SUCCESS,
    payload: { data },
  }),

  requestAllOrderFailure: err => ({
    type: Types.ALL_ORDER_FAILURE,
    payload: { err },
  }),

  setLocation: (latitude, longitude, data) => ({
    type: Types.SET_LOCATION_REQUEST,
    payload: { latitude, longitude, data },
  }),

  updateOrderStatus: (orderUid, status, data) => ({
    type: Types.UPDATE_ORDER_STATUS_REQUEST,
    payload: { orderUid, status, data },
  }),

  updateOrderStatusSuccess: data => ({
    type: Types.UPDATE_ORDER_STATUS_REQUEST_SUCCESS,
    payload: { data },
  }),

  updateOrderStatusFailure: err => ({
    type: Types.UPDATE_ORDER_STATUS_REQUEST_FAIL,
    payload: { err },
  }),

  setLocationSuccess: data => ({
    type: Types.SET_LOCATION_SUCCESS,
    payload: { data },
  }),

  setLocationFailure: err => ({
    type: Types.SET_LOCATION_FAIL,
    payload: { err },
  }),

  closeOrder: data => ({
    type: Types.CLOSE_ORDER_REQUEST,
    payload: { data },
  }),

  closeOrderSuccess: data => ({
    type: Types.CLOSE_ORDER_SUCCESS,
    payload: { data },
  }),

  closeOrderFailure: err => ({
    type: Types.CLOSE_ORDER_FAIL,
    payload: { err },
  }),

  isOrderClosed: data => ({
    type: Types.IS_ORDER_CLOSE_REQUEST,
    payload: { data },
  }),

  isOrderClosedSuccess: data => ({
    type: Types.IS_ORDER_CLOSE_SUCCESS,
    payload: { data },
  }),

  isOrderClosedFailure: err => ({
    type: Types.IS_ORDER_CLOSE_FAIL,
    payload: { err },
  }),

  openOrder: data => ({
    type: Types.OPEN_ORDER_REQUEST,
    payload: { data },
  }),

  openOrderSuccess: data => ({
    type: Types.OPEN_ORDER_SUCCESS,
    payload: { data },
  }),

  openOrderFailure: err => ({
    type: Types.OPEN_ORDER_FAIL,
    payload: { err },
  }),

  getOrderByUid: (orderUid, data) => ({
    type: Types.GET_ORDER_BY_UID_REQUEST,
    payload: { orderUid, data },
  }),

  getOrderByUidSuccess: data => ({
    type: Types.GET_ORDER_BY_UID_SUCCESS,
    payload: { data },
  }),

  getOrderByUidFailure: err => ({
    type: Types.GET_ORDER_BY_UID_FAIL,
    payload: { err },
  }),
};

const admin = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.UPDATE_ORDER_STATUS_REQUEST:
      return {
        ...state,
        error: false,
      };
    case Types.UPDATE_ORDER_STATUS_REQUEST_SUCCESS:
      return {
        ...state,
        error: false,
      };
    case Types.UPDATE_ORDER_STATUS_REQUEST_FAIL:
      return {
        ...state,
        error: true,
        message: { payload },
      };

    case Types.ALL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        setLocation: false,
      };

    case Types.ALL_ORDER_SUCCESS:
      return {
        ...state,
        allOrder: payload,
        loading: false,
        error: false,
      };

    case Types.ALL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };
    case Types.SET_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case Types.SET_LOCATION_SUCCESS:
      return {
        ...state,
        setLocation: payload,
        loading: false,
        error: false,
      };
    case Types.SET_LOCATION_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };

    case Types.CLOSE_ORDER_REQUEST:
      return {
        ...state,
        error: false,
      };
    case Types.CLOSE_ORDER_SUCCESS:
      return {
        ...state,
        orderClosed: payload,
        error: false,
      };
    case Types.CLOSE_ORDER_FAIL:
      return {
        ...state,
        error: true,
        message: { payload },
      };

    case Types.IS_ORDER_CLOSE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case Types.IS_ORDER_CLOSE_SUCCESS:
      return {
        ...state,
        orderClosed: payload,
        loading: false,
        error: false,
      };
    case Types.IS_ORDER_CLOSE_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };

    case Types.OPEN_ORDER_REQUEST:
      return {
        ...state,
        error: false,
      };
    case Types.OPEN_ORDER_SUCCESS:
      return {
        ...state,
        orderClosed: payload,
        error: false,
      };
    case Types.OPEN_ORDER_FAIL:
      return {
        ...state,
        error: true,
        message: { payload },
      };

    case Types.GET_ORDER_BY_UID_REQUEST:
      return {
        ...state,
        error: false,
      };
    case Types.GET_ORDER_BY_UID_SUCCESS:
      return {
        ...state,
        orderDetail: payload,
        error: false,
      };
    case Types.GET_ORDER_BY_UID_FAIL:
      return {
        ...state,
        error: true,
        message: { payload },
      };

    default:
      return state;
  }
};

export default admin;
