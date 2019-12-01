// @flow

import React from 'react';
import {
  Picker, Text, View, ScrollView,
} from 'react-native';

import styled from 'styled-components';
import appStyles from '~/styles';

import { Snackbar } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import Header from './Header';
import ButtonContent from '../../../../screens/login/components/ButtonContent';
import { DefaultText } from '../../../../screens/login/components/Common';

const Container = styled(View)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.metrics.largeSize}px;
  padding-top: ${({ theme }) => theme.metrics.largeSize}px;
  margin-horizontal: ${({ theme }) => theme.metrics.largeSize}px;
  border-top-left-radius: ${({ theme }) => theme.metrics.borderRadius}px;
  border-top-right-radius: ${({ theme }) => theme.metrics.borderRadius}px;
  background-color: ${({ theme }) => theme.colors.defaultWhite};
`;

const SubContainer = styled(View)`
  padding-top: ${({ theme }) => theme.metrics.largeSize}px;
`;

const DishDescription = styled(Text).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 3,
})`
  margin-top: ${({ theme }) => theme.metrics.mediumSize}px;
  color: ${({ theme }) => theme.colors.subText};
  font-size: ${({ theme }) => theme.metrics.getWidthFromDP('4.2%')}px;
  font-family: CircularStd-Book;
`;

type Props = {
  dishDetail: Object,
};

const OptionWithouDescriptionWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.metrics.largeSize}px;
`;

const Card = ({
  coffeeDetail,
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
  const {
    description, id, image, selection, startPrice, title,
  } = coffeeDetail;
  const {
    containerStyle,
    pickerStyle,
    subContainerStyle,
    buttonStyle,
  } = styles;
  return (
    <Container>
      <Header
        price={totalPrice.toFixed(2)}
        title={title}
      />
      <DishDescription>{description}</DishDescription>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <SubContainer>
          {selection.map(data => (
            <View
              key={data.id}
              style={subContainerStyle}
            >
              <Text>{data.label}</Text>
              <View
                style={pickerStyle}
              >
                <Picker
                  selectedValue={selectedValue[data.type]}
                  onValueChange={(itemValue) => {
                    onSelectionChanced(data, itemValue);
                  }}
                >
                  {data.items.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.itemName}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ))}
          <View
            style={subContainerStyle}
          >
            <Text>Adet</Text>
            <NumericInput
              onChange={value => amountChanged(value)}
              value={productAmount}
            />
          </View>
        </SubContainer>

        <View
          style={buttonStyle}
        >
          <ButtonContent
            color={appStyles.colors.primaryColor}
            onPress={a => orderAction()}
          >
            <DefaultText>Sepete Ekle</DefaultText>
          </ButtonContent>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        duration={7000}
        onDismiss={() => onSnackBarDismis()}
        action={{
          label: 'Sepete Git',
          onPress: () => {
            onSnackbarAction();
          },
        }}
      >
        Siparişiniz sepete eklendi!
      </Snackbar>
    </Container>
  );
};

const styles = {
  pickerStyle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  textInputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2,
  },
  buttonStyle: {
    paddingTop: 20,
  },
  subContainerStyle: {
    paddingTop: 10,
  },
};
export default Card;
