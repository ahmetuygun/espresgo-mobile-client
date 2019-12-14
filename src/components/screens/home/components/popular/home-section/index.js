// @flow

import React from 'react';
import { View, FlatList } from 'react-native';
import styled from 'styled-components';

import PopularSectionListItem from './PopularSectionListItem';

const Container = styled(View)`
  justify-content: space-between;
  width: 100%;
  padding-top: ${({ theme }) => `${theme.metrics.extraSmallSize}px`};
`;

const ListWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
`;

type Props = {
  product: Array<Object>,
  medium: boolean,
};

const PopularSection = ({ product, medium }: Props): Object => (
  <Container>
    <ListWrapper>
      <FlatList
        renderItem={({ item, index }) => (
          <PopularSectionListItem
            imageURL={item.image}
            isFirst={index === 0}
            price={item.price}
            title={item.title}
            id={item.id}
            medium={medium}
          />
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        data={product}
        horizontal
      />
    </ListWrapper>
  </Container>
);

export default PopularSection;
