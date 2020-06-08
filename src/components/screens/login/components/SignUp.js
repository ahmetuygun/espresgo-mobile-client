// @flow

import React, { Component } from 'react';
import {AsyncStorage, View} from 'react-native';

import styled from 'styled-components';

import appStyles from '~/styles';

import { ROUTE_NAMES } from '~/routes';
import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';
import SMSVerifyCode from 'react-native-sms-verifycode';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as SignUpCreators } from '~/store/ducks/signUp';
import { withNavigation } from 'react-navigation';

import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog';
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  activeteUser, hasAddress,
} from '../../../../services/APIUtils';
import { DefaultText } from './Common';
import ButtonContent from './ButtonContent';
import Input from './Input';
import CONSTANTS from "~/utils/CONSTANTS";

const Container = styled(View)`
  height: 100%;
`;

class SignUp extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.validateField = this.validateField.bind(this);

    this.state = {
      name: {
        value: '',
        placeHolder: 'İsim',
        placeHolderColor: 'aliceblue',
        valid: true,
      },
      phone: {
        value: '',
        placeHolder: 'Telefon 5--',
        placeHolderColor: 'aliceblue',
        valid: true,
      },
      email: {
        value: '',
        placeHolder: 'E-mail',
        placeHolderColor: 'aliceblue',
        valid: true,
      },
      password: {
        value: '',
        placeHolder: 'Şifre',
        placeHolderColor: 'aliceblue',
        valid: true,
      },
      response: {},
      dialogVisible: false,
      loading: false,
      error: false,
      isSmsValidationOK: false,
      smsCode: '',
      token: '',
      smsValidatorMessage: 'Telefonunuza gelen kodu giriniz',
      smsValidationDialogVisible: false,
    };
  }

  onChange(n, v) {
    this.setState({
      [n]: {
        value: v,
      },
    });
  }

  validateEmail = (email) => {
    if (email === '') {
      return {
        valid: false,
        placeHolder: 'Email alanı boş olamaz.',
        placeHolderColor: 'tomato',
      };
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
      return {
        valid: false,
        placeHolder: 'Yanlış email formatı.',
        placeHolderColor: 'tomato',
        value: '',
      };
    }

    if (email.length > 30) {
      return {
        valid: false,
        placeHolder: `Çok uzun, en fazla ${30} karakter olmalı.`,
        placeHolderColor: 'tomato',
      };
    }

    return {
      valid: null,
      placeHolderColor: null,
      placeHolder: null,
    };
  };

  validateEmailAvailability(email) {
    const emailValidation = this.validateEmail(email);

    if (emailValidation.valid === false) {
      return {
        value: email,
        ...emailValidation,
      };
    }

    return checkEmailAvailability(email)
      .then((response) => {
        console.log(response.available);
        console.log(response);
        if (response.available === true) {
          this.setState({
            email: {
              ...this.state.email,
              value: email,
              valid: true,
              placeHolder: null,
            },
          });
        } else {
          this.setState({
            email: {
              ...this.state.email,
              valid: false,
              placeHolder:
                'daha önce bu email adresi ile kullanıcı oluşturuldu. ',
              placeHolderColor: 'tomato',
              value: '',
            },
          });
        }
      })
      .catch(error => ({
        value: email,
        valid: true,
        placeHolder: null,
      }));
  }

  validatePhone = (phone) => {
    if (phone === '') {
      return {
        valid: false,
        placeHolder: 'Telefon boş olamaz',
        placeHolderColor: 'tomato',
      };
    }

    const PHONE_REGEX = RegExp('^[1-9]{1}[0-9]{9}$');
    if (!PHONE_REGEX.test(phone)) {
      return {
        valid: false,
        placeHolder: 'Lütfen, başına 0 koymadan 10 haneli olarak girin',
        placeHolderColor: 'tomato',
        value: '',
      };
    }
    if (phone.length > 10) {
      return {
        valid: false,
        placeHolder: `Çok uzun, en fazla ${10} karakter olmalı.`,
        placeHolderColor: 'tomato',
      };
    }

    return {
      valid: null,
      placeHolderColor: null,
      placeHolder: null,
    };
  };

  validatePhoneAvailability(phone) {
    const phoneValdation = this.validatePhone(phone);
    if (phoneValdation.valid === false) {
      return {
        value: phone,
        ...phoneValdation,
      };
    }
    return checkUsernameAvailability(phone)
      .then((response) => {
        if (response.available) {
          this.setState({
            phone: {
              ...this.state.phone,
              value: phone,
              valid: true,
              placeHolder: null,
            },
          });
        } else {
          this.setState({
            phone: {
              ...this.state.phone,
              valid: false,
              placeHolder: 'daha önce bu numarayla kullanıcı oluşturuldu. ',
              placeHolderColor: 'tomato',
              value: '',
            },
          });
        }
      })
      .catch(error =>
        // Marking validateStatus as success, Form will be recchecked at server
        ({
          value: phone,
          valid: true,
          placeHolder: null,
        }));
  }

  validatePassword = (password) => {
    if (password.length < 4) {
      return {
        valid: false,
        placeHolder: `Şifre en az ${4} karakter olmalı`,
        placeHolderColor: 'tomato',
        value: '',
      };
    }
    if (password.length > 15) {
      return {
        valid: false,
        placeHolder: `Şifre en çok ${15} karakter olmalıdır.`,
        placeHolderColor: 'tomato',
        value: '',
      };
    }
    return {
      value: password,
      valid: true,
      placeHolder: null,
    };
  };

  async validateField(a, state) {
    const emailValidation = await this.validateEmailAvailability(
      state.email.value,
    );
    const phoneValidation = await this.validatePhoneAvailability(
      state.phone.value,
    );
    const passwordValidation = await this.validatePassword(
      state.password.value,
    );

    this.setState(
      {
        name: {
          ...this.state.name,
          placeHolderColor: state.name.value === '' ? 'tomato' : 'aliceblue',
          valid: state.name.value !== '',
        },
        phone: {
          ...this.state.phone,
          ...phoneValidation,
        },
        email: {
          ...this.state.email,
          ...emailValidation,
        },
        password: {
          ...this.state.password,
          ...passwordValidation,
        },
      },
      () => this.handleLogin(this.state),
    );
  }

  validateSms() {
    this.setState({
      smsValidationDialogVisible: true,
    });
  }

  handleLogin(a) {
    const { signUpRequest } = this.props;
    if (a.name.valid && a.email.valid && a.password.valid && a.phone.valid) {
      signUpRequest(
        a.name.value,
        a.email.value,
        a.password.value,
        a.phone.value,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { registered, loading } = nextProps.signUp;
    this.setState({
      loading,
    });
    if (
      registered == true
      && nextProps.signUp
      && nextProps.signUp.message
      && nextProps.signUp.message.payload.data
      && nextProps.signUp.message.payload.data.success
    ) {
      this.validateSms();
    } else if (
      loading == false
      && registered == false
      && nextProps.signUp
      && nextProps.signUp.message
      && nextProps.signUp.message.payload.err.response
    ) {
      this.setState({
        response: nextProps.signUp.message.payload.err.response.data.errors,
        dialogVisible: true,
      });
    }
  }

  renderInput = (
    placeholder: string,
    iconName: string,
    type: string,
    name: string,
    value: string,
    placeholderTextColor: string,
  ): Object => (
    <Input
      placeholder={placeholder}
      iconName={iconName}
      type={type}
      name={name}
      onChange={this.onChange}
      value={value}
      placeholderTextColor={placeholderTextColor}
    />
  );
  onInputCompleted = (otp) => {
    activeteUser(otp, this.state.phone.value).then((response) => {
      if (response && response.success === true) {
        this.setState({ smsValidationDialogVisible: false });
        this.setState({ smsValidatorMessage: 'Başarılı!' });
        AsyncStorage.setItem('accessToken', response.message);

        const { navigation  } = this.props;
        hasAddress(response.message)
          .then((res) => {
            debugger;
            console.log("res >" + res);
            if (!res) {
              navigation.navigate(ROUTE_NAMES.ADDRESS, {
                [CONSTANTS.COME_FROM_REGISTER]: true,
              });
            } else {
              navigation.navigate(ROUTE_NAMES.MAIN_STACK);
            }
          })
          .catch((error) => {
            navigation.navigate(ROUTE_NAMES.ADDRESS);
          });

      } else {
        this.setState({ smsValidatorMessage: 'Yanlış Kod' });
      }
    });
  };

  onInputChangeText = (text) => {
    console.log('');
  };

  renderMainContent = () => (
    <Container>
      {this.renderInput(
        this.state.name.placeHolder,
        'account-circle',
        'name',
        'name',
        this.state.name.value,
        this.state.name.placeHolderColor,
      )}
      {this.renderInput(
        this.state.phone.placeHolder,
        'cellphone',
        'telephoneNumber',
        'phone',
        this.state.phone.value,
        this.state.phone.placeHolderColor,
      )}
      {this.renderInput(
        this.state.email.placeHolder,
        'email-outline',
        'emailAddress',
        'email',
        this.state.email.value,
        this.state.email.placeHolderColor,
      )}
      {this.renderInput(
        this.state.password.placeHolder,
        'lock-outline',
        'password',
        'password',
        this.state.password.value,
        this.state.password.placeHolderColor,
      )}

      <Dialog
        visible={this.state.smsValidationDialogVisible}
        dialogTitle={<DialogTitle
          title={this.state.smsValidatorMessage}
        />}
        onTouchOutside={() => {
          this.setState({ smsValidationDialogVisible: false });
        }}
      >
        <DialogContent>
          <SMSVerifyCode
            onInputCompleted={this.onInputCompleted}
            onInputChangeText={this.onInputChangeText}
            verifyCodeLength={4}
            containerPaddingVertical={20}
            codeFontSize={20}
            containerPaddingHorizontal={50}
            autoFocus
          />
        </DialogContent>
      </Dialog>

      <ButtonContent
        color={appStyles.colors.primaryColor}
        onPress={a => this.validateField(a, this.state)}
      >
        <DefaultText>Kaydet</DefaultText>
      </ButtonContent>
    </Container>
  );

  render() {
    return (
      <View>
        {this.state.loading && <Loading />}
        {this.state.error && <Alert
          type={TYPES.ERROR_SERVER_CONNECTION}
        />}
        {!this.state.loading && !this.state.error && this.renderMainContent()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(SignUpCreators, dispatch);

const mapStateToProps = state => ({
  signUp: state.signUp,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(SignUp));
