// @flow

import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as CoffeeCreators } from '~/store/ducks/coffee';
import CONSTANTS from '~/utils/CONSTANTS';

import SeeAllPopular from './SeeAllPopular';

type Props = {
  requestCoffee: Function,
  coffee: Object,
};

class SeeAllPopularContainer extends Component<Props, {}> {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    debugger;
    const list = navigation.getParam(CONSTANTS.SEE_ALL_LIST, '');
    debugger;
    this.setState({
      list,
    });
  }

  render() {
    const { list } = this.state;
    return (
      <SeeAllPopular
        list={list}
        loading={list.length === 0}
        error={false}
      />
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
)(SeeAllPopularContainer);
