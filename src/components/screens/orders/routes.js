import { createStackNavigator } from 'react-navigation';

import { setDefaultHeaderLayout } from '~/routes/headerUtils';

import Orders from './index';

export const ROUTE_NAMES = {
  ORDERS: 'ORDERS',
};

const ROUTES = createStackNavigator({
  [ROUTE_NAMES.ORDERS]: {
    screen: Orders,
    navigationOptions: ({ navigation }) => setDefaultHeaderLayout(navigation, 'Sepetim'),
  },
});

export default ROUTES;
