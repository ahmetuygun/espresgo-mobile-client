// @flow

import React, { Component } from 'react';
import {TouchableOpacity, Animated, View, Text, AsyncStorage} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';

import ButtonContent from './ButtonContent';
import { DefaultText } from './Common';
import Input from './Input';
import { ROUTE_NAMES } from '~/routes';

import {
  activeteUser,
  sendCode,hasAddress
} from '../../../../services/APIUtils';
import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';

import appStyles from '~/styles';
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';
import { Creators as LoginCreators } from '~/store/ducks/login';
import {withNavigation} from "react-navigation";
import Dialog, {DialogContent, DialogTitle} from "react-native-popup-dialog";
import SMSVerifyCode from "react-native-sms-verifycode";


const Container = styled(View)`
  width: 100%;
  height: 100%;
`;



const ForgotPasswordContainer = styled(Animated.View)`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ForgotPasswordWrapper = styled(View)`
  flex-direction: row;
`;

const RecoverTextButton = styled(TouchableOpacity)`
  margin-left: 4px;
`;

const createAnimationStyle = (animation: Object): Object => {
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 0],
  });

  return {
    opacity: animation,
    transform: [
      {
        translateY,
      },
    ],
  };
};

class LoginComponent extends Component<Props, State> {
  _emailInputFieldAnimation = new Animated.Value(0);
  _passwordInputFieldAnimation = new Animated.Value(0);
  _loginButtonAnimation = new Animated.Value(0);
  _loginFacebookButtonAnimation = new Animated.Value(0);
  _loginGooglePlusButtonAnimation = new Animated.Value(0);
  _forgotPasswordTextAnimation = new Animated.Value(0);


  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);


    this.state = {
      user: {
        value : '',
        placeHolder : '',
        placeHolderColor: 'aliceblue',
        valid : true
      },
      password: {
        value : '',
        placeHolder : '',
        placeHolderColor: 'aliceblue',
        valid : true
      },
      phone: {
        value : '',
        placeHolder : 'Telefon 5--',
        placeHolderColor: 'aliceblue',
        valid : true
      },
      dialogVisible : false,
      loading : false,
      error : false,
      forgetPassword : false,
      smsValidatorMessage: 'Telefonunuza gelen kodu giriniz',
      smsValidationDialogVisible: false,

    }

  }

  onChange(n,v) {

    if(n === 'email') {
      this.setState({
        user: {
          value : v
        }
      })
    }

    if(n === 'password') {
      this.setState({
        password: {
          value : v
        }
      })
    }

    if(n === 'phone') {
      this.setState({
        phone: {
          value : v
        }
      })
    }
  }


  validateField = () =>{

      this.setState({
        user: {
          ...this.state.user,
          placeHolderColor: this.state.user.value === '' ? 'tomato' : 'aliceblue' ,
          valid: this.state.user.value !== ''
        },
        password: {
          ...this.state.password,
          placeHolderColor:  this.state.password.value === '' ? 'tomato' : 'aliceblue',
          valid:  this.state.password.value !== ''
        }
      }, () => this.handleLogin(this.state.user, this.state.password));

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
      valid: true,
      placeHolderColor: null,
      placeHolder: null,
    };
  };

  handleLogin= (user,pass) =>{

    if(user.valid === true && pass.valid === true){
        const { loginRequest } = this.props;
        loginRequest(user.value, pass.value)
      }

    }

  componentWillReceiveProps(nextProps){
    const { authenticated, loading, error } = nextProps.login;
    const { navigation  } = this.props;
    this.setState({
      loading : loading,
    })

    if(authenticated){
      this.setState({dialogVisible: false})
      navigation.navigate(ROUTE_NAMES.ONBOARDING_INTRO)
    }else if(nextProps.login && nextProps.login.message && nextProps.login.message.payload.data.response){
      const { data  } = nextProps.login.message.payload.data.response;
      console.log(data.message)
      this.setState(
        {
          dialogVisible: true,
          user: {
            value : ''
          },
          password: {
            value : ''
          }
        }
        )
    }
  }

  componentDidMount() {

    Animated.stagger(100, [
      Animated.timing(this._emailInputFieldAnimation, {
        toValue: 1,
        duration: 350,
      }),
      Animated.timing(this._passwordInputFieldAnimation, {
        toValue: 1,
        duration: 350,
      }),
      Animated.timing(this._loginButtonAnimation, {
        toValue: 1,
        duration: 350,
      }),
      Animated.timing(this._loginFacebookButtonAnimation, {
        toValue: 1,
        duration: 350,
      }),
      Animated.timing(this._loginGooglePlusButtonAnimation, {
        toValue: 1,
        duration: 350,
      }),
      Animated.timing(this._forgotPasswordTextAnimation, {
        toValue: 1,
        duration: 350,
      }),
    ]).start();
  }

  renderInput = (
    placeholder: string,
    iconName: string,
    type: string,
    style: Object,
    onChange : function,
    name : string,
    placeholderTextColor : string
  ): Object => (
    <Input
      placeholder={placeholder}
      iconName={iconName}
      style={style}
      type={type}
      onChange={this.onChange}
      name={name}
      placeholderTextColor ={placeholderTextColor}
    />
  );

  renderForgotPasswordText = (): Object => {
    const forgotPasswordTextAnimationStyle = createAnimationStyle(
      this._forgotPasswordTextAnimation,
    );

    return (
      <ForgotPasswordContainer>
        <ForgotPasswordWrapper>
          <RecoverTextButton  onPress={() => this.setState({forgetPassword : true})  }>
            <DefaultText
              color={appStyles.colors.white}
            >
              Şifremi unuttum
            </DefaultText>
          </RecoverTextButton>
        </ForgotPasswordWrapper>
      </ForgotPasswordContainer>
    );
  };

  renderLoginText = (): Object => {
    const forgotPasswordTextAnimationStyle = createAnimationStyle(
      this._forgotPasswordTextAnimation,
    );

    return (
      <ForgotPasswordContainer>
        <ForgotPasswordWrapper>
          <RecoverTextButton  onPress={() => this.setState({forgetPassword : false})  }>
            <DefaultText
              color={appStyles.colors.white}
            >
             Giriş
            </DefaultText>
          </RecoverTextButton>
        </ForgotPasswordWrapper>
      </ForgotPasswordContainer>
    );
  };



  renderForgetPassword = () => {

    const emailAnimationStyle = createAnimationStyle(
      this._emailInputFieldAnimation,
    );
    return (
      <Container>
        {this.renderInput(
          this.state.phone.placeHolder ,
          'cellphone',
          'telephoneNumber',
          emailAnimationStyle,
          this.onChange(),
          'phone',
          this.state.phone.placeHolderColor
        )}

        <ButtonContent
          color={appStyles.colors.primaryColor}
          onPress = {() =>  {this.validatePhoneNumber()}}
        >
          <DefaultText>Kod Gönder</DefaultText>
        </ButtonContent>
        {this.renderLoginText()}

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

        </Container>
    )
  }

  onInputCompleted = (otp) => {
    debugger;
    console.log(otp);
    activeteUser(otp, this.state.phone.value).then((response) => {
      console.log(response);
      if (response && response.success === true) {
        this.setState({ smsValidationDialogVisible: false });
        this.setState({ smsValidatorMessage: 'Başarılı!' });
        AsyncStorage.setItem('accessToken', response.message);
        debugger;
        const { navigation  } = this.props;
        navigation.navigate(ROUTE_NAMES.ONBOARDING_INTRO)

      } else {
        this.setState({ smsValidatorMessage: 'Yanlış Kod' });
      }
    });
  };

  onInputChangeText = (text) => {
    console.log('');
  };

  _sendCode = (a) => {
    if(a.valid){
      sendCode(a.value).then((response) => {
        if (response && response.success === true) {
          this.setState({ smsValidationDialogVisible: true })
          this.setState({ smsValidatorMessage: response.message });
        } else {
          this.setState({ forgetPasswordErrorMessage: response.message });
        }
      }).catch(error => {
      console.log(error)
      });;

    }


  }

  async validatePhoneNumber() {
    const phoneValidation = await this.validatePhone(
      this.state.phone.value,
    );
    console.log(this.state.phone);
    this.setState(
      {
        phone: {
          ...this.state.phone,
          ...phoneValidation,
        }}, () => this._sendCode(this.state.phone),
        )


  }

  renderMainContent = () => {

    const emailAnimationStyle = createAnimationStyle(
      this._emailInputFieldAnimation,
    );
    const passwordAnimationStyle = createAnimationStyle(
      this._passwordInputFieldAnimation,
    );
    const loginButtonAnimationStyle = createAnimationStyle(
      this._loginButtonAnimation,
    );

    return (
      <Container>

          {this.renderInput(
            'E-mail',
            'email-outline',
            'emailAddress',
            emailAnimationStyle,
            this.onChange(),
            'email',
            this.state.user.placeHolderColor
          )}

          {this.renderInput(
            'Şifre',
            'lock-outline',
            'password',
            passwordAnimationStyle,
            this.onChange(),
            'password',
            this.state.password.placeHolderColor
          )}

          <ButtonContent
            color={appStyles.colors.primaryColor}
            onPress = {(a) =>  {this.validateField()}}
          >
            <DefaultText>Giriş</DefaultText>
          </ButtonContent>
        {this.renderForgotPasswordText()}

        <Dialog
          visible={this.state.dialogVisible}
          dialogTitle={<DialogTitle title="Hata!" />}
          onTouchOutside={() => {
            this.setState({dialogVisible: false});
          }}
        >
          <DialogContent>
            <Text numberOfLines={5}>
              Kullanıcı adı veya şifre hatalı!
            </Text>
          </DialogContent>
        </Dialog>

      </Container>
    );
}


render() {
  return (
    <View>
      {this.state.loading && <Loading />}
      {this.state.error && <Alert
        type={TYPES.ERROR_SERVER_CONNECTION}
      />}
      {!this.state.forgetPassword && !this.state.loading && !this.state.error && this.renderMainContent()}
      {this.state.forgetPassword && !this.state.loading && !this.state.error && this.renderForgetPassword()}

    </View>
  );
}
}

const mapDispatchToProps = dispatch => bindActionCreators(LoginCreators, dispatch);

const mapStateToProps = state => ({
  login: state.login,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(LoginComponent));
