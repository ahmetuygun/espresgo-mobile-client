// @flow

import React, { Fragment } from 'react';
import { StatusBar, View, ScrollView } from 'react-native';

import { withNavigation } from 'react-navigation';
import styled from 'styled-components';

import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';

import Header from './Header';
import Card from './card';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.dark};
`;

type Props = {
  navigation: Function,
  coffeeDetail: Object,
  loading: Object,
  error: Object,
};

const DishDetail = ({
  navigation,
  coffeeDetail,
  loading,
  error,
  onSelectionChanced,
  selectedValue,
  totalPrice,
  orderAction,
  snackbarVisible,
  onSnackbarAction,
  onSnackBarDismis,
  amountChanged,
  productAmount,
}: Props): Object => {
  const shouldShowContent = Object.keys(coffeeDetail).length > 0 && !loading && !error;
  return (
    <Fragment>
      <StatusBar
        backgroundColor="transparent"
        barStyle={error || loading ? 'dark-content' : 'light-content'}
        translucent
        animated
      />
      {loading && <Loading />}
      {error && (
        <Alert
          type={TYPES.ERROR_SERVER_CONNECTION}
          withExtraTopPadding
        />
      )}
      {shouldShowContent && (
        <Container>
          <Header
            thumbnailImageURL={coffeeDetail.image}
            restaurantId={coffeeDetail.id}
            imageURL={coffeeDetail.image}
            navigation={coffeeDetail}
          />
          <Card
            coffeeDetail={coffeeDetail}
            onSelectionChanced={onSelectionChanced}
            selectedValue={selectedValue}
            totalPrice={totalPrice}
            orderAction={orderAction}
            snackbarVisible={snackbarVisible}
            onSnackbarAction={onSnackbarAction}
            onSnackBarDismis={onSnackBarDismis}
            amountChanged={amountChanged}
            productAmount={productAmount}
          />
        </Container>
      )}
    </Fragment>
  );
};

export default withNavigation(DishDetail);
