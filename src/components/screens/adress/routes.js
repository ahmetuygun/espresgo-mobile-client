import { createStackNavigator } from 'react-navigation';

import { setDefaultHeaderLayout } from '~/routes/headerUtils';

import Address from './index';

export const ROUTE_NAMES = {
  ADDRESS: 'ADDRESS',
};

const ROUTES = createStackNavigator({
  [ROUTE_NAMES.ADDRESS]: {
    screen: Address,
    navigationOptions: ({ navigation }) => setDefaultHeaderLayout(navigation, 'Kullanıcı Bilgileri'),
  },
});

export default ROUTES;
