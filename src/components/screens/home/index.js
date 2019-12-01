// @flow

import React, { Component } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as CoffeeCreators } from '~/store/ducks/coffee';

import { persistItemInStorage } from '~/utils/AsyncStoarageManager';
import CONSTANTS from '~/utils/CONSTANTS';
import appStyles from '~/styles';

import { Alert, TYPES } from '~/components/common/alert';
import Loading from '~/components/common/Loading';

import PopularSection from './components/popular/home-section';

import Section from './components/Section';
import { ROUTE_NAMES } from './routes';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  requestCoffee: Function,
  coffee: Object,
};

type State = {
  isRefresing: boolean,
};

type HomeRequestResult = {
  list: Object,
};

class Home extends Component<Props, State> {
  state = {
    isRefresing: false,
  };

  componentWillMount() {
    this.requestData();
  }

  async componentWillReceiveProps(nextProps) {
    const { coffee } = nextProps;
    this.setState({
      isRefresing: false,
    });
  }

  requestData = (): void => {
    const { requestCoffee } = this.props;

    requestCoffee();
  };

  renderMainContent = (data: HomeRequestResult): Object => {
    const { isRefresing } = this.state;
    const hasPopularDishes = true;

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
        {hasPopularDishes && (
          <Section
            nextRoute={ROUTE_NAMES.POPULAR_SEE_ALL}
            title="Espresso Bazlı İçecekler"
          >
            <PopularSection
              coffee={data}
            />
          </Section>
        )}
      </ScrollView>
    );
  };

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
