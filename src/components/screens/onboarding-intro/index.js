// @flow

import React, { Component } from 'react';
import {
  StatusBar, FlatList, View, AsyncStorage,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import styled from 'styled-components';

import BottomPagination from './components/BottomPagination';
import GetStartedButton from './components/GetStartedButton';
import { SCREENS, TYPES } from './components/SCREENS_TYPES';
import IntroScreen from './components/IntroScreen';

import { ROUTE_NAMES } from '~/routes/index';
import appStyles from '~/styles';
import { hasAddress } from '../../../services/APIUtils';
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';
import { Creators as MapActions } from '~/store/ducks/map';

const Container = styled(View)`
  flex: 1;
`;

const IntroScreenWrapper = styled(View)`
  width: ${({ theme }) => theme.metrics.width}px;
  height: ${({ theme }) => theme.metrics.height}px;
`;

const BottomContent = styled(View)`
  width: 100%;
  margin-top: ${({ theme }) => theme.metrics.getHeightFromDP('85%')}px;
  padding-horizontal: ${({ theme }) => theme.metrics.extraLargeSize}px;
  position: absolute;
`;

const PAGES = [SCREENS[TYPES.ONE], SCREENS[TYPES.TWO], SCREENS[TYPES.THREE]];

type Props = {
  navigation: Object,
};

type State = {
  currentPageIndex: number,
};

class OnboardingIntro extends Component<Props, State> {
  state = {
    currentPageIndex: 0,
    render: false,
  };

  getInitialRouteName = () => {
    const { navigation, setMyLocation } = this.props;

    SplashScreen.hide();
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        console.log(`token${data}`);
        if (data) {
          hasAddress(data)
            .then((response) => {
              console.log(`response${response}`);

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  // user location's latitude and longitude
                  const latitude = parseFloat(position.coords.latitude);
                  const longitude = parseFloat(position.coords.longitude);
                  setMyLocation(
                    latitude,
                    longitude,
                    data,
                  );
                },
                error => console.log('position error!!!', error),
                { enableHighAccuracy: true, timeout: 30000 },
              );

              if (!response) {
                navigation.navigate(ROUTE_NAMES.ADDRESS);
              } else {

                navigation.navigate(ROUTE_NAMES.MAIN_STACK);
              }
            })
            .catch((error) => {
              navigation.navigate(ROUTE_NAMES.LOGIN);
            });
        } else {
          AsyncStorage.getItem('splashScreen')
            .then((data2) => {
              if (data2) navigation.navigate(ROUTE_NAMES.LOGIN);
              else {
                this.setState({
                  render: true,
                });
                 AsyncStorage.setItem('splashScreen', '1');
              }
            })
            .catch((err2) => {});
        }
      })
      .catch((err) => {
        AsyncStorage.getItem('splashScreen')
          .then((data2) => {
            if (data2) navigation.navigate(ROUTE_NAMES.LOGIN);
            else {
              this.setState({
                render: true,
              });
               AsyncStorage.setItem('splashScreen', '1');
            }
          })
          .catch((err2) => {});
      });
  };

  componentWillMount() {
    this.getInitialRouteName();
  }

  onIncrementPageIndex = (): void => {
    const { currentPageIndex } = this.state;

    this.setState(
      {
        currentPageIndex: currentPageIndex + 1,
      },
      () => this.onSlidePage(),
    );
  };

  onDecrementPageIndex = (): void => {
    const { currentPageIndex } = this.state;

    this.setState(
      {
        currentPageIndex: currentPageIndex - 1,
      },
      () => this.onSlidePage(),
    );
  };

  onSlidePage = (): void => {
    const { currentPageIndex } = this.state;

    this._pagesListRef.scrollToIndex({
      animated: true,
      index: currentPageIndex,
    });
  };

  onFlatlistMomentumScrollEnd = (event: Object): void => {
    const { contentOffset } = event.nativeEvent;

    const isHorizontalSwipeMovement = contentOffset.x > 0;
    const currentPageIndex = isHorizontalSwipeMovement
      ? Math.ceil(contentOffset.x / appStyles.metrics.width)
      : 0;

    this.setState({
      currentPageIndex,
    });
  };

  renderPages = (): Object => (
    <FlatList
      onMomentumScrollEnd={event => this.onFlatlistMomentumScrollEnd(event)}
      renderItem={({ item }) => (
        <IntroScreenWrapper>
          <IntroScreen
            {...item}
          />
        </IntroScreenWrapper>
      )}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.title}
      ref={(ref: any): void => {
        this._pagesListRef = ref;
      }}
      bounces={false}
      pagingEnabled
      data={PAGES}
      horizontal
    />
  );

  renderPaginationController = (): Object => {
    const { currentPageIndex } = this.state;
    const { navigation } = this.props;

    const PAGINATION_CONTROLLERS = [
      <BottomPagination
        onPressRightButton={this.onIncrementPageIndex}
        onPressLeftButton={() => navigation.navigate(ROUTE_NAMES.LOGIN)}
        currentIndex={0}
        numberOfDots={3}
        withSkip
      />,
      <BottomPagination
        onPressRightButton={this.onIncrementPageIndex}
        onPressLeftButton={this.onDecrementPageIndex}
        currentIndex={1}
        numberOfDots={3}
      />,
      <GetStartedButton />,
    ];

    const Controller = PAGINATION_CONTROLLERS[currentPageIndex];

    return <BottomContent>{Controller}</BottomContent>;
  };

  render() {
    return (
      <Container>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
          animated
        />
        {this.state.render ? this.renderPages() : null}
        {this.state.render ? this.renderPaginationController() : null}
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
)(OnboardingIntro);
