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
import {Dropdown} from 'react-native-material-dropdown';

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
    pickerStyle,
    subContainerStyle,
    buttonStyle,
    subButtonStyle,
  } = styles;
  debugger
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
          {selection.map(selectData => (
            <View
              key={selectData.id}
              style={subContainerStyle}
            >
              <View>

                <Dropdown
                  value={selectedValue[selectData.type]}
                  onChangeText={(value) => {
                    onSelectionChanced(selectData, value);
                  }}
                  label={selectData.label}
                  valueExtractor={({id}) => id}
                  labelExtractor={({ itemName}) => itemName}
                  data={selectData.items}
                />
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

        <View style={buttonStyle}>
          <View style={subButtonStyle}>
            <ButtonContent
              color={appStyles.colors.primaryColor}
              onPress={a => orderAction()}
            >
              <DefaultText>Sepete Ekle</DefaultText>
            </ButtonContent>
          </View>
          <View
            style={subButtonStyle}
          >
            <ButtonContent
              color={appStyles.colors.primaryColor}
              onPress={a => onSnackbarAction()}
            >
              <DefaultText>Sepete Git</DefaultText>
            </ButtonContent>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};


const renderDropDown = (
  dataSource,
  label,
  selectedName,
  selectFunction: function
): Object => (
  <Dropdown
    value={selectedName.name}
    onChangeText={selectFunction}
    label={label}
    valueExtractor={({id}) => id}
    labelExtractor={({name}) => name}
    data={dataSource}
  />

);

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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:  20,
  },
  subButtonStyle: {
    flex: 1,
    paddingLeft: 3,
    paddingRight: 3,
    margin: 0

  },
  subContainerStyle: {

  },
};
export default Card;
