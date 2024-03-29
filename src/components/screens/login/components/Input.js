// @flow

import React from 'react';
import { TextInput, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';

import { ContentContainer } from './Common';
import appStyles from '~/styles';

const InputWrapper = styled(View)`
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.metrics.largeSize}px;
`;

const InputIcon = styled(Icon).attrs(({ iconName }) => ({
  name: iconName,
  size: 22,
}))`
  margin-right: ${({ theme }) => theme.metrics.mediumSize}px;
  color: ${({ theme }) => theme.colors.defaultWhite};
`;

const CustomInput = styled(TextInput).attrs(({ placeholder, type, theme,onChange,name, value,placeholderTextColor }) => ({
  placeholderTextColor: placeholderTextColor,
  selectionColor: theme.colors.defaultWhite,
  underlineColorAndroid: 'transparent',
  secureTextEntry: type === 'password',
  autoCapitalize: 'none',
  textContentType: type,
  autoCorrect: false,
  placeholder,
  onChangeText : (value) => onChange(name, value),
  value : {value},

}))`
  width: 90%;
  height: 100%;
  font-family: CircularStd-Book;
  color: ${({ theme }) => theme.colors.defaultWhite};
`;


type InputProps = {
  placeholder: string,
  iconName: string,
  type: string,
  onChange : function,
  name : string
};

const Input = ({ placeholder, iconName, type, onChange, name, value, placeholderTextColor }: InputProps): Object => (
  <ContentContainer
    color={appStyles.colors.transparentGray}
  >
    <InputWrapper>
      <InputIcon
        iconName={iconName}
      />
      <CustomInput
        placeholder={placeholder}
        type={type}
        onChange = {onChange}
        name = {name}
        value = {value}
        placeholderTextColor = {placeholderTextColor}
      />
    </InputWrapper>
  </ContentContainer>
);

export default Input;
