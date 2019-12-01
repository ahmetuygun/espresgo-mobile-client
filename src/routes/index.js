import { AsyncStorage } from 'react-native';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import OnboardingIntro from '~/components/screens/onboarding-intro';
import Login from '~/components/screens/login';
import MainStack from './mainStack';
import Address from '../components/screens/adress/routes';
import Orders from '../components/screens/orders/routes';
import Admin from '../components/screens/admin/routes';

export const ROUTE_NAMES = {
  ONBOARDING_INTRO: 'ONBOARDING_INTRO',
  LOGIN: 'LOGIN',
  MAIN_STACK: 'MAIN_STACK',
  ADDRESS: 'ADDRESS',
  ORDERS: 'ORDERS',
  ADMIN: 'ADMIN',
};

const InitialStack = createSwitchNavigator(
  {
    [ROUTE_NAMES.ONBOARDING_INTRO]: {
      screen: OnboardingIntro,
    },
    [ROUTE_NAMES.LOGIN]: {
      screen: Login,
    },
    [ROUTE_NAMES.MAIN_STACK]: {
      screen: MainStack,
    },
    [ROUTE_NAMES.ADDRESS]: {
      screen: Address,
    },
    [ROUTE_NAMES.ORDERS]: {
      screen: Orders,
    },
    [ROUTE_NAMES.ADMIN]: {
      screen: Admin,
    },
  },
  {
    initialRouteName: ROUTE_NAMES.ONBOARDING_INTRO,
  },
);

const AppContainer = createAppContainer(InitialStack);

export default AppContainer;
