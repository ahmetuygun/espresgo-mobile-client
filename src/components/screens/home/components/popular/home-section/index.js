// @flow

import React from 'react';
import { View, FlatList } from 'react-native';
import styled from 'styled-components';

import PopularSectionListItem from './PopularSectionListItem';

const Container = styled(View)`
  justify-content: space-between;
  width: 100%;
  padding-top: 15px;
`;

const ListWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
`;

type Props = {
  coffee: Array<Object>,
};

const PopularSection = ({ coffee }: Props): Object => (
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
          />
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        data={coffee.list}
        horizontal
      />
    </ListWrapper>
  </Container>
);

export default PopularSection;
