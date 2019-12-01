// @flow

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import { ROUTE_NAMES } from '~/routes';
import { ContentContainer } from './Common';

type Props = {
  navigation: Object,
  children: Object,
  color: string,
};

const ButtonContent = ({
  onPress,
  navigation,
  children,
  color,
}: Props): Object => (
  <TouchableOpacity
    onPress={onPress}
  >
    <ContentContainer
      color={color}
    >
      {children}
    </ContentContainer>
  </TouchableOpacity>
);

export default withNavigation(ButtonContent);
