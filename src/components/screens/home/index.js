// @flow

import React, { Component } from 'react';
import {Platform, RefreshControl, ScrollView, Text, View, Linking, AsyncStorage} from 'react-native';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as CoffeeCreators } from '~/store/ducks/coffee';

import { persistItemInStorage } from '~/utils/AsyncStoarageManager';
import appStyles from '~/styles';

import {
  activeteUser,
  getWhatsAppNumber
} from '../../../services/APIUtils';

import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';

import PopularSection from './components/popular/home-section';

import Section from './components/Section';
import { ROUTE_NAMES } from './routes';
import {Snackbar} from "react-native-paper";

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  requestCoffee: Function,
  coffee: Object,
};

type State = {
  isRefresing: bYouMightLikeSectionoolean,
};

const OptionWithouDescriptionWrapperHead = styled(View)`
  align-items: center;

`;
const MediumText = styled(Text)`
  color: ${({theme}) => theme.colors.green};
  margin-top: ${({theme}) => theme.metrics.smallSize};
  font-family: CircularStd-Bold;
  font-size: ${({theme}) => {
  const percentage = Platform.OS === 'ios' ? '4%' : '4.5%';
  return theme.metrics.getWidthFromDP(percentage);
}}px;
`;
type HomeRequestResult = {
  list: Object,
};

class Home extends Component<Props, State> {
  state = {
    isRefresing: false,
    snackbarVisible: false
  };



  componentWillMount() {
    this.requestData();
  }

  async componentWillReceiveProps(nextProps) {
    const { coffee } = nextProps;
    this.setState({
      isRefresing: false,
      snackbarVisible : coffee.snackbarVisible
    });
  }

  componentWillUnmount() {

      this.setState({
        snackbarVisible : false
      });

  }

  requestData = (): void => {
    const { requestCoffee } = this.props;

    requestCoffee();
  };

  redirectWhatsapp = (): void => {
    getWhatsAppNumber().then((number) => {
      if (number) {

        Linking.openURL('whatsapp://send?text='+'&phone='+number)

      } else {
      }
    });

  };

  renderMainContent = (data: HomeRequestResult): Object => {
    const { isRefresing } = this.state;

    let coffee = [];
    let sandvic = [];
    let cold = [];
    if (data && data.list && data.list.length > 0) {
      coffee = data.list.filter(item => item.productType === 'COFFEE');
      sandvic = data.list.filter(item => item.productType === 'SAND');
      cold = data.list.filter(item => item.productType === 'COLD');
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={appStyles.colors.primaryColor}
            tintColor={appStyles.colors.primaryColor}
            colors={[appStyles.colors.white]}
            onRefresh={this.requestData}
            refreshing={isRefresing}
          />
        }
      >
        <OptionWithouDescriptionWrapperHead>
          <MediumText  onPress={()=>{this.redirectWhatsapp()}} >Whatsapp'dan yaz</MediumText>
        </OptionWithouDescriptionWrapperHead>
        <Section
          nextRoute={ROUTE_NAMES.POPULAR_SEE_ALL}
          product={coffee}
          title="Espresso Bazlı İçecekler"
        >
          <PopularSection
            product={coffee}
            medium={false}
          />
        </Section>
        <Section
          nextRoute={ROUTE_NAMES.POPULAR_SEE_ALL}
          product={sandvic}
          title="Sandviç, Atıştırmalık"
        >
          <PopularSection
            product={sandvic}
            medium
          />
        </Section>
        <Section
          nextRoute={ROUTE_NAMES.POPULAR_SEE_ALL}
          product={cold}
          title="Soğuk, Smoothie"
        >
          <PopularSection
            product={cold}
            medium={false}
          />
        </Section>
      </ScrollView>
    );
  };
  onSnackBarDismis()
  {
    this.setState({
      snackbarVisible: false,
    });
  }

  onSnackbarAction()
  {
    const {navigation} = this.props;
    navigation.goBack(null);
    navigation.navigate("ORDERS");
    console.log('onSnackbarAction');
    this.setState({
      snackbarVisible: false,
    });
  }

  render() {
    const { coffee } = this.props;
    const { loading, error } = coffee;
    return (
      <Container>
        {loading && <Loading />}
        {error && <Alert
          type={TYPES.ERROR_SERVER_CONNECTION}
        />}
        {!loading && !error && this.renderMainContent(coffee.coffee)}
        <Snackbar
          visible={this.state.snackbarVisible}
          duration={6000}
          onDismiss={() => this.onSnackBarDismis()}
          action={{
            label: 'Sepete Git',
            onPress: () => {
              this.onSnackbarAction();
            },
          }}
        >
          Siparişiniz sepete eklendi!
        </Snackbar>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  coffee: state.coffee,
});

const mapDispatchToProps = dispatch => bindActionCreators(CoffeeCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
