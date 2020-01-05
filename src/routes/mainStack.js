// @flow

import React from 'react';

import {
  createMaterialTopTabNavigator,
  createAppContainer,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeRoutes from '~/components/screens/home/routes';
import AddressRoutes from '~/components/screens/adress/routes';
import OrdersRoutes from '~/components/screens/orders/routes';
import NearYouRoutes from '~/components/screens/near-you/routes';
import AdminsRoutes from '~/components/screens/admin/routes';

import isEqualsOrLargestThanIphoneX from '~/utils/isEqualsOrLargestThanIphoneX';
import appStyles from '~/styles';

export const ROUTE_NAMES = {
  HOME: 'HOME',
  SEARCH_RESTAURANTS: 'SEARCH_RESTAURANTS',
  NEAR_YOU: 'NEAR_YOU',
  ADDRESS: 'ADDRESS',
  SETTINGS: 'SETTINGS',
  ORDERS: 'ORDERS',
  ADMIN: 'ADMIN',
};

type Props = {
  tintColor: string,
};

const getTabIcon = (icon: string): Object => ({ tintColor }: Props) => (
  <Icon
    color={tintColor}
    name={icon}
    size={25}
  />
);

const ApplicationTabs = createMaterialTopTabNavigator(
  {
    [ROUTE_NAMES.HOME]: {
      screen: HomeRoutes,
      navigationOptions: {
        tabBarIcon: getTabIcon('home'),
      },
    },
    [ROUTE_NAMES.ORDERS]: {
      screen: OrdersRoutes,
      navigationOptions: {
        tabBarIcon: getTabIcon('basket'),
      },
    },
    [ROUTE_NAMES.NEAR_YOU]: {
      screen: NearYouRoutes,
      navigationOptions: {
        tabBarIcon: getTabIcon('map'),
      },
    },
    [ROUTE_NAMES.ADDRESS]: {
      screen: AddressRoutes,
      navigationOptions: {
        tabBarIcon: getTabIcon('account-settings'),
      },
    },
  },
  {
    initialRouteName: ROUTE_NAMES.HOME,
    tabBarPosition: 'bottom',
    optimizationsEnabled: true,
    animationEnabled: true,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      style: {
        paddingBottom: isEqualsOrLargestThanIphoneX() ? 30 : 0,
        backgroundColor: appStyles.colors.white,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      indicatorStyle: {
        backgroundColor: 'transparent',
      },
      inactiveTintColor: appStyles.colors.gray,
      activeTintColor: appStyles.colors.primaryColor,
    },
  },
);

const AppContainer = createAppContainer(ApplicationTabs);

export default AppContainer;
