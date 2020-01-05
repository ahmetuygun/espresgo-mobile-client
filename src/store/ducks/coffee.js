import Immutable from 'seamless-immutable';

export const Types = {
  GET_COFFEE_DETAIL_REQUEST: 'coffee/GET_COFFEE_DETAIL_REQUEST',
  GET_COFFEE_DETAIL_SUCCESS: 'coffee/GET_COFFEE_DETAIL_SUCCESS',
  GET_COFFEE_DETAIL_FAILURE: 'coffee/GET_COFFEE_DETAIL_FAILURE',
  GET_COFFEE_REQUEST: 'coffee/GET_COFFEE_REQUEST',
  GET_COFFEE_SUCCESS: 'coffee/GET_COFFEE_SUCCESS',
  GET_COFFEE_FAILURE: 'coffee/GET_COFFEE_FAILURE',
  ORDER_COFFEE_REQUEST: 'coffee/ORDER_COFFEE_REQUEST',
  ORDER_COFFEE_SUCCESS: 'coffee/ORDER_COFFEE_SUCCESS',
  ORDER_COFFEE_FAILURE: 'coffee/ORDER_COFFEE_FAILURE',

  ORDER_SINGLE_REQUEST: 'coffee/ORDER_SINGLE_REQUEST',
  ORDER_SINGLE_SUCCESS: 'coffee/ORDER_SINGLE_SUCCESS',
  ORDER_SINGLE_FAILURE: 'coffee/ORDER_SINGLE_FAILURE',

  REMOVE_ORDER_SINGLE_REQUEST: 'coffee/REMOVE_ORDER_SINGLE_REQUEST',
  REMOVE_ORDER_SINGLE_SUCCESS: 'coffee/REMOVE_ORDER_SINGLE_SUCCESS',
  REMOVE_ORDER_SINGLE_FAILURE: 'coffee/REMOVE_ORDER_SINGLE_FAILURE',

  ORDER_HISTORY_REQUEST: 'coffee/ORDER_HISTORY_REQUEST',
  ORDER_HISTORY_SUCCESS: 'coffee/ORDER_HISTORY_SUCCESS',
  ORDER_HISTORY_FAILURE: 'coffee/ORDER_HISTORY_FAILURE',

  REFRESH_ALL: 'coffee/REFRESH_ALL',
};

const initialState = {
  loading: false,
  coffeeDetail: {},
  error: false,
  coffee: [],
  orderResult: {},
  message: {},
  orders: [],
  orderResultSingleCode: 0,
  refreshHistory: false,
};

export const Creators = {
  requestCoffee: () => ({
    type: Types.GET_COFFEE_REQUEST,
  }),

  requestCoffeeSuccess: data => ({
    type: Types.GET_COFFEE_SUCCESS,
    payload: { data },
  }),

  requestCoffeeFailure: () => ({
    type: Types.GET_COFFEE_FAILURE,
  }),

  requestHistory: token => ({
    type: Types.ORDER_HISTORY_REQUEST,
    payload: { token },
  }),

  requestHistorySuccess: data => ({
    type: Types.ORDER_HISTORY_SUCCESS,
    payload: { data },
  }),

  requestHistoryFailure: () => ({
    type: Types.ORDER_HISTORY_FAILURE,
  }),

  requestCoffeeDetail: id => ({
    type: Types.GET_COFFEE_DETAIL_REQUEST,
    payload: { id },
  }),

  requestCoffeeDetailSuccess: data => ({
    type: Types.GET_COFFEE_DETAIL_SUCCESS,
    payload: { data },
  }),

  requestCoffeeDetailFailure: () => ({
    type: Types.GET_COFFEE_DETAIL_FAILURE,
  }),

  orderCoffee: (orders, token) => ({
    type: Types.ORDER_COFFEE_REQUEST,
    payload: { orders, token },
  }),

  orderCoffeeSuccess: data => ({
    type: Types.ORDER_COFFEE_SUCCESS,
    payload: { data },
  }),

  orderCoffeeFailure: err => ({
    type: Types.ORDER_COFFEE_FAILURE,
    payload: { err },
  }),

  orderSingle: data => ({
    type: Types.ORDER_SINGLE_REQUEST,
    payload: { data },
  }),

  orderSingleSuccess: data => ({
    type: Types.ORDER_SINGLE_SUCCESS,
    payload: { data },
  }),

  orderSingleFailure: err => ({
    type: Types.ORDER_SINGLE_FAILURE,
    payload: { err },
  }),

  removeOrderSingle: data => ({
    type: Types.REMOVE_ORDER_SINGLE_REQUEST,
    payload: { data },
  }),

  removeOrderSingleSuccess: data => ({
    type: Types.REMOVE_ORDER_SINGLE_SUCCESS,
    payload: { data },
  }),

  removeOrderSingleFailure: err => ({
    type: Types.REMOVE_ORDER_SINGLE_FAILURE,
    payload: { err },
  }),
  refreshAll: () => ({
    type: Types.REFRESH_ALL,
  }),
};

const coffee = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.GET_COFFEE_REQUEST:
      return {
        ...state,
        loading: true,
        orderResult: {},
        error: false,
      };

    case Types.GET_COFFEE_SUCCESS:
      return {
        ...state,
        coffee: payload.data,
        loading: false,
      };

    case Types.GET_COFFEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
      };

    case Types.ORDER_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        refreshHistory: false,
      };

    case Types.ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        history: payload.data,
        loading: false,
      };

    case Types.ORDER_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case Types.GET_COFFEE_DETAIL_REQUEST:
      return {
        ...state,
        orderResult: {},
        loading: true,
        error: false,
      };

    case Types.GET_COFFEE_DETAIL_SUCCESS:
      return {
        ...state,
        coffeeDetail: payload.data,
        loading: false,
        error: false,
        orderResultSingleCode: 0,
      };

    case Types.GET_COFFEE_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
      };

    case Types.ORDER_COFFEE_REQUEST:
      return {
        ...state,
        orderResult : {},
        loading: true,
        error: false,
      };

    case Types.ORDER_COFFEE_SUCCESS:
      return {
        ...state,
        orderResult: payload.data,
        loading: false,
        error: false,
        orders: (payload.data.responseCode &&
          payload.data.responseCode ===102)  ? state.orders : [],
        orderResultSingleCode: 0,
      };

    case Types.ORDER_COFFEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };

    case Types.ORDER_SINGLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        orderResultSingleCode: 0,
      };

    case Types.ORDER_SINGLE_SUCCESS:
      return {
        ...state,
        orders: payload.data,
        loading: false,
        error: false,
        orderResultSingleCode: 100,
      };

    case Types.ORDER_SINGLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };

    case Types.REMOVE_ORDER_SINGLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case Types.REMOVE_ORDER_SINGLE_SUCCESS:
      return {
        ...state,
        orders: payload.data,
        loading: false,
        error: false,
      };

    case Types.REMOVE_ORDER_SINGLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: false,
      };
    case Types.REFRESH_ALL:
      return {
        ...state,
        loading: false,
        error: false,
        orderResult: {},
        message: {},
        orders: [],
        orderResultSingleCode: 0,
        refreshHistory: true,
      };
    default:
      return state;
  }
};

export default coffee;
