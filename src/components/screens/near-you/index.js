// @flow

import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as MapActions } from '~/store/ducks/map';
import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';

import { getItemFromStorage } from '~/utils/AsyncStoarageManager';
import CONSTANTS from '~/utils/CONSTANTS';
import MapView, { Marker } from 'react-native-maps';

import styled from 'styled-components';
import {
  AsyncStorage, Image, View, Dimensions,
} from 'react-native';

const MapContainer = styled(MapView)`
  width: 100%;
  height: 100%;
`;

const Container = styled(View)`
  flex: 1;
  padding: ${({ theme }) => theme.metrics.mediumSize}px;
  background-color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  requestNearbyRestaurants: Function,
  nearbyRestaurants: Object,
};

type State = {
  restaurantsCached: Array<Object>,
  indexDishesTypeSelected: number,
  indexRestaurantSelected: number,
  userLocation: Object,
};

class NearYouContainer extends Component<Props, State> {
  state = {
    userLocation: {
      latitude: CONSTANTS.FORTALEZA_CITY_LOCATION.latitude,
      longitude: CONSTANTS.FORTALEZA_CITY_LOCATION.longitude,
    },
    shouldMoveRestaurantList: false,
    indexDishesTypeSelected: 0,
    indexRestaurantSelected: 0,
    restaurantsCached: [],
    lon: 0.0,
    lat: 0.0,
    myLocation: {
      latitude: 0.0,
      longitude: 0.0,
    },
  };

  async componentDidMount() {
    const { requestVehicleLocation, setMyLocation } = this.props;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // user location's latitude and longitude
        const latitude = parseFloat(position.coords.latitude);
        const longitude = parseFloat(position.coords.longitude);
        AsyncStorage.getItem('accessToken')
          .then((data) => {
            if (data) {
              console.log(data);
              requestVehicleLocation(data);
              setMyLocation(
                position.coords.latitude,
                position.coords.longitude,
                data,
              );
            }
          })
          .catch((err) => {});

        const myLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };
        this.setState({ myLocation });
      },
      error => console.log('position error!!!', error),
      { enableHighAccuracy: true, timeout: 30000 },
    );

    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };
        this.setState({
          myLocation: {
            ...this.state.myLocation,
            latitude,
            longitude,
          },
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
  }

  renderMap = (vehicleLocation) => {
    const { width, height } = Dimensions.get('window');

    const ASPECT_RATIO = width / height;
    const latDelta = Math.abs(
      vehicleLocation.latitude - this.state.myLocation.latitude,
    );
    const lngDelta = latDelta * ASPECT_RATIO;

    return (
      <MapContainer
        initialRegion={{
          latitude: vehicleLocation.latitude,
          longitude: vehicleLocation.longitude,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }}
      >
        <Marker
          coordinate={{
            latitude: vehicleLocation.latitude,
            longitude: vehicleLocation.longitude,
          }}
        >
          <Image
            source={require('./output-onlinepngtools.png')}
            style={{ height: 100, width: 100 }}
          />
        </Marker>

        <Marker
          coordinate={{
            latitude: this.state.myLocation.latitude,
            longitude: this.state.myLocation.longitude,
          }}
        >
          <Image
            source={require('./map-marker-icon.png')}
            style={{ height: 100, width: 100 }}
          />
        </Marker>

        {}

        <MapView.Polyline
          coordinates={[
            {
              latitude: this.state.myLocation.latitude,
              longitude: this.state.myLocation.longitude,
            },
            {
              latitude: vehicleLocation.latitude,
              longitude: vehicleLocation.longitude,
            },
          ]}
          strokeWidth={5}
          strokeColor="brown"
        />
      </MapContainer>
    );
  };

  render() {
    const { vehicleLocation, loading, error } = this.props.map;

    return (
      <Container>
        {loading && <Loading />}
        {error && <Alert
          type={TYPES.ERROR_SERVER_CONNECTION}
        />}

        {vehicleLocation
          && vehicleLocation.data
          && !loading
          && !error
          && this.renderMap(vehicleLocation.data)}
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(MapActions, dispatch);

const mapStateToProps = state => ({
  map: state.map,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearYouContainer);
