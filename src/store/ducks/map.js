export const Types = {
  VEHICLE_LOCATION_REQUEST: 'map/VEHICLE_LOCATION_REQUEST',
  VEHICLE_LOCATION_SUCCESS: 'map/VEHICLE_LOCATION_SUCCESS',
  VEHICLE_LOCATION_FAILURE: 'map/VEHICLE_LOCATION_FAILURE',

  SET_MY_LOCATION_REQUEST: 'map/SET_MY_LOCATION_REQUEST',
  SET_MY_LOCATION_SUCCESS: 'map/SET_MY_LOCATION_SUCCESS',
  SET_MY_LOCATION_FAIL: 'map/SET_MY_LOCATION_FAIL',
};

const initialState = {
  loading: false,
  error: false,
  vehicleLocation: {},
  message: {},
};

export const Creators = {
  requestVehicleLocation: token => ({
    type: Types.VEHICLE_LOCATION_REQUEST,
    payload: { token },
  }),

  requestVehicleLocationSuccess: data => ({
    type: Types.VEHICLE_LOCATION_SUCCESS,
    payload: { data },
  }),

  requestVehicleLocationFailure: err => ({
    type: Types.VEHICLE_LOCATION_FAILURE,
    payload: { err },
  }),

  setMyLocation: (latitude, longitude, data) => ({
    type: Types.SET_MY_LOCATION_REQUEST,
    payload: { latitude, longitude, data },
  }),

  setMyLocationSuccess: data => ({
    type: Types.SET_MY_LOCATION_SUCCESS,
    payload: { data },
  }),

  setMyLocationFailure: err => ({
    type: Types.SET_MY_LOCATION_FAIL,
    payload: { err },
  }),
};

const map = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.VEHICLE_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        setLocation: false,
      };

    case Types.VEHICLE_LOCATION_SUCCESS:
      return {
        ...state,
        vehicleLocation: payload,
        loading: false,
        error: false,
      };

    case Types.VEHICLE_LOCATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };
    case Types.SET_MY_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case Types.SET_MY_LOCATION_SUCCESS:
      return {
        ...state,
        setLocation: payload,
        loading: false,
        error: false,
      };
    case Types.SET_MY_LOCATION_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        message: { payload },
      };
    default:
      return state;
  }
};

export default map;
