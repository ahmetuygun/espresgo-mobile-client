import { createStackNavigator } from 'react-navigation';

import { setDefaultHeaderLayout } from '~/routes/headerUtils';

import Admin from './index';

export const ROUTE_NAMES = {
  ADMIN: 'ADMIN',
};

const ROUTES = createStackNavigator({
  [ROUTE_NAMES.ADMIN]: {
    screen: Admin,
    navigationOptions: ({ navigation }) => setDefaultHeaderLayout(navigation, 'Admin'),
  },
});

export default ROUTES;
