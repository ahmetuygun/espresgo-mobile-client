// @flow

import React from 'react';
import { FlatList, View } from 'react-native';

import styled from 'styled-components';

import PopularSeeAllItemList from './PopularSeeAllItemList';
import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';

const Wrapper = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  isDishesEmpty: boolean,
  dishes: Array<Object>,
  loading: boolean,
  error: boolean,
  list: Array<Object>,
};

const AllYouMightLike = ({ loading, error, list }: Props): Object => {
  const shouldRenderContent = !loading && !error && list;
  return (
    <Wrapper>
      {loading && <Loading />}
      {error && <Alert
        type={TYPES.ERROR_SERVER_CONNECTION}
      />}
      {shouldRenderContent && (
        <FlatList
          renderItem={({ item }) => (
            <PopularSeeAllItemList
              price={parseFloat(item.price).toFixed(2)}
              description={item.description}
              imageURL={item.image}
              title={item.title}
              id={item.id}
            />
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          data={list}
        />
      )}
    </Wrapper>
  );
};

export default AllYouMightLike;
