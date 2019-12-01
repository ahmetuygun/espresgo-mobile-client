// @flow

import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as CoffeeCreators } from '~/store/ducks/coffee';

import SeeAllPopular from './SeeAllPopular';

type Props = {
  requestCoffee: Function,
  coffee: Object,
};

class SeeAllPopularContainer extends Component<Props, {}> {
  componentDidMount() {
    const { requestCoffee } = this.props;

    requestCoffee();
  }

  render() {
    const { coffee } = this.props;
    return <SeeAllPopular
      {...coffee}
    />;
  }
}

const mapStateToProps = state => ({
  coffee: state.coffee,
});

const mapDispatchToProps = dispatch => bindActionCreators(CoffeeCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeeAllPopularContainer);
