// @flow

import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as CoffeeCreators } from '~/store/ducks/coffee';
import { AsyncStorage } from 'react-native';

import { handleHiddenHeaderStyle } from '~/routes/headerUtils';
import DishDetail from './components/DishDetail';
import CONSTANTS from '~/utils/CONSTANTS';
import { ROUTE_NAMES } from '../../../routes';

type Props = {
  requestDishDetail: Function,
  navigation: Object,
  dish: Object,
};

class DishDetailContainer extends Component<Props, {}> {
  _subscriptionWillFocusEvent = {};

  constructor(props) {
    super(props);
    this.onSelectionChanced = this.onSelectionChanced.bind(this);
    this.onSnackBarDismis = this.onSnackBarDismis.bind(this);
    this.onSnackbarAction = this.onSnackbarAction.bind(this);
    this.amountChanged = this.amountChanged.bind(this);

    this.order = this.order.bind(this);
    this.state = {
      mySelection: [],
      allSelection: [],
      selectionKey: [],
      snackbarVisible: false,
      productAmount: 1,
      totalPrice: 0,
    };
  }

  componentDidMount() {
    const { requestCoffeeDetail, navigation } = this.props;
    const id = navigation.getParam(CONSTANTS.NAVIGATION_PARAM_ID, '');
    this._subscriptionWillFocusEvent = navigation.addListener('willFocus', () => handleHiddenHeaderStyle(navigation, false, false));
    requestCoffeeDetail(id);
    this.setState({ snackbarVisible: false });
  }

  async componentWillReceiveProps(nextProps) {
    const {
      loading,
      error,
      coffeeDetail,
      orderResultSingleCode,
    } = nextProps.coffee;
    const { navigation } = this.props;

    handleHiddenHeaderStyle(navigation, loading, error);
    if (coffeeDetail !== null && coffeeDetail.selection.length > 0) {
      this.setState({
        allSelection: coffeeDetail.selection,
      });

      coffeeDetail.selection.map((current) => {
        const currentItem = Object.assign({}, current);
        currentItem.items = [];
        currentItem.items.push(current.items[0]);

        if (
          this.state.mySelection.filter(
            filterItem => filterItem.type === current.type,
          ).length === 0
        ) {
          this.setState(prevState => ({
            mySelection: [...prevState.mySelection, currentItem],
          }));
        }

        if (!this.state.selectionKey[current.type]) {
          this.setState(prevState => ({
            selectionKey: {
              ...prevState.selectionKey,
              [current.type]: current.items[0].id,
            },
          }));
        }
      });
    }

    if (orderResultSingleCode === 100) {
      this.setState({ snackbarVisible: true });
    }
  }

  componentWillUnmount() {
    this._subscriptionWillFocusEvent.remove();
  }

  order() {
    const { coffeeDetail, orders } = this.props.coffee;
    const { orderSingle } = this.props;
    const uui = Math.floor(1000 + Math.random() * 9000);

    const order = {
      coffeeDetail,
      selection: this.state.mySelection,
      uui,
      productAmount: this.state.productAmount,
      totalPrice: this.state.totalPrice,
    };

    const list = orders;
    list.push({ order });
    orderSingle(list);
  }

  onSnackbarAction() {
    const { navigation } = this.props;
    navigation.goBack(null);
    navigation.navigate(ROUTE_NAMES.ORDERS);
    console.log('onSnackbarAction');
    this.setState({
      snackbarVisible: false,
    });
  }

  onSnackBarDismis() {
    this.setState({
      snackbarVisible: false,
    });
  }

  onSelectionChanced(data, itemValue) {
    if (
      this.state.mySelection.filter(filterItem => filterItem.type === data.type)
        .length !== 0
    ) {
      this.setState(prevState => ({
        mySelection: prevState.mySelection.map(el => (el.type === data.type
          ? {
            ...el,
            items: data.items.filter(
              filterItem => filterItem.id === itemValue,
            ),
          }
          : el)),
      }));
    }
  }

  amountChanged(amount) {
    this.setState({
      productAmount: amount,
    });
  }

  render() {
    const {
      navigation, loading, error, coffeeDetail,
    } = this.props.coffee;

    let totalPrice = coffeeDetail.startPrice;
    this.state.mySelection.map((item) => {
      totalPrice += item.items[0].plusPrice;
    });
    totalPrice *= this.state.productAmount;

    return (
      <DishDetail
        navigation={navigation}
        coffeeDetail={coffeeDetail}
        loading={loading}
        error={error}
        selectedValue={this.state.selectionKey}
        onSelectionChanced={this.onSelectionChanced}
        totalPrice={totalPrice}
        orderAction={this.order}
        snackbarVisible={this.state.snackbarVisible}
        onSnackbarAction={this.onSnackbarAction}
        onSnackBarDismis={this.onSnackBarDismis}
        amountChanged={this.amountChanged}
        productAmount={this.state.productAmount}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(CoffeeCreators, dispatch);

const mapStateToProps = state => ({
  coffee: state.coffee,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DishDetailContainer);
