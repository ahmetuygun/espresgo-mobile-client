// @flow

import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as CoffeeCreators } from '~/store/ducks/coffee';
import {
  getBuildingByDistrict,
  getCities,
  getCompanyByBuilding,
  getDistrictByCity,
} from '~/services/APIUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonContent from '../login/components/ButtonContent';
import { DefaultText } from '../login/components/Common';
import appStyles from '~/styles';
import Loading from '~/components/common/Loading';
import { Alert, TYPES } from '~/components/common/alert';
import { ROUTE_NAMES } from '../../../routes';

const Container = styled(View)`
  flex: 1;
  padding: ${({ theme }) => theme.metrics.mediumSize}px;
  background-color: ${({ theme }) => theme.colors.white};
`;
const ItemWrapper = styled(View)`
  padding: ${({ theme }) => theme.metrics.mediumSize}px;
`;
const OptionWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SectionTitleText = styled(Text)`
  color: ${({ theme }) => theme.colors.darkText};
  font-family: CircularStd-Bold;
  font-size: ${({ theme }) => {
    const percentage = Platform.OS === 'ios' ? '4.2%' : '4.8%';
    return theme.metrics.getWidthFromDP(percentage);
  }}px;
`;
const SmallText = styled(Text)`
  color: ${({ theme }) => theme.colors.subText};
  margin: ${({ theme }) => `${theme.metrics.extraSmallSize}px 0`};
  font-family: CircularStd-Book;
  font-size: ${({ theme }) => {
    const percentage = Platform.OS === 'ios' ? '3.8%' : '4%';
    return theme.metrics.getWidthFromDP(percentage);
  }}px;
`;
const OptionTextWrapper = styled(View)`
  width: 75%;
`;

const LineSeparator = styled(View)`
  width: 100%;
  height: ${({ theme }) => theme.metrics.getHeightFromDP('0.1%')};
  background-color: ${({ theme }) => theme.colors.gray};
`;
const OptionWithouDescriptionWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.metrics.largeSize}px;
`;

const OptionWithouDescriptionWrapperHead = styled(View)`
  align-items: center;
  margin: ${({ theme }) => theme.metrics.extraLargeSize}px;
`;

const MediumText = styled(Text)`
  color: ${({ theme }) => theme.colors.subText};
  margin-top: ${({ theme }) => theme.metrics.extraSmallSize};
  font-family: CircularStd-Bold;
  font-size: ${({ theme }) => {
    const percentage = Platform.OS === 'ios' ? '4%' : '4.5%';
    return theme.metrics.getWidthFromDP(percentage);
  }}px;
`;

const MediumTextGreen = styled(Text)`
  color: ${({ theme }) => theme.colors.green};
  margin-top: ${({ theme }) => theme.metrics.extraSmallSize};
  font-family: CircularStd-Bold;
  font-size: ${({ theme }) => {
    const percentage = Platform.OS === 'ios' ? '7%' : '7%';
    return theme.metrics.getWidthFromDP(percentage);
  }}px;
`;

const MediumTextBlack = styled(Text)`
  color: ${({ theme }) => theme.colors.darkText};
  margin-top: ${({ theme }) => theme.metrics.extraSmallSize};
  font-family: CircularStd-Bold;
  font-size: ${({ theme }) => {
    const percentage = Platform.OS === 'ios' ? '4%' : '4.5%';
    return theme.metrics.getWidthFromDP(percentage);
  }}px;
`;

class Orders extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      orderList: [],
      token: {},
    };
  }

  async componentWillMount() {
    const { orders } = this.props.coffee;
    this.setState({
      orderList: orders,
    });

    const { requestHistory } = this.props;
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        if (data) {
          requestHistory(data);
          this.setState({
            token: data,
          });
        }
      })
      .catch((err) => {});
  }

  orderAction() {
    const { orderCoffee } = this.props;
    const { orders } = this.props.coffee;
    const list = [];

    orders.map((order) => {
      let price = order.order.coffeeDetail.startPrice;

      order.order.selection.map((item) => {
        price += item.items[0].plusPrice;
      });
      price *= order.order.productAmount;

      list.push({
        id: order.order.coffeeDetail.id,
        selection: order.order.selection,
        productAmount: order.order.productAmount,
        totalPrice: price,
      });
    });

    AsyncStorage.getItem('accessToken')
      .then((data) => {
        debugger;
        if (data) {
          orderCoffee(list, data);
        }
      })
      .catch((err) => {});
  }

  removeOrder(id) {
    const { orders } = this.props.coffee;
    const { removeOrderSingle } = this.props;

    const list = orders.filter(item => item.order.uui !== id);
    removeOrderSingle(list);
  }

  renderItemWitDescription = (coffeDetail, detail, price, uui, amount) => (
    <ItemWrapper>
      <OptionWrapper>
        <TouchableOpacity
          onPress={() => this.removeOrder(uui)}
        >
          <Icon
            color="#900"
            name="minus"
            size={25}
          />
        </TouchableOpacity>
        {this.renderOptionWithDescription(coffeDetail.title, detail, amount)}
        <SectionTitleText>{price}</SectionTitleText>
      </OptionWrapper>
    </ItemWrapper>
  );

  renderItemWitDescriptionForHistory = (date, items, price) => (
    <ItemWrapper>
      <OptionWrapper>
        {this.renderOptionWithDescriptionForHistory(date, items)}
        <SectionTitleText>{price}</SectionTitleText>
      </OptionWrapper>
    </ItemWrapper>
  );

  renderOptionWithDescriptionForHistory = (
    title: string,
    description: string,
  ): Object => (
    <OptionTextWrapper>
      <MediumText>{title}</MediumText>
      <SmallText>{description}</SmallText>
    </OptionTextWrapper>
  );

  renderOptionWithDescription = (title, description, amount) => (
    <OptionTextWrapper>
      <MediumText>{title}</MediumText>
      {description.map(item => (
        <SmallText>{`${item.label}: ${item.items[0].itemName}`}</SmallText>
      ))}
      <SmallText>{`Adet:  X${amount}`}</SmallText>
    </OptionTextWrapper>
  );

  renderOrderCheckList = (orders) => {
    let totalPrice = 0.0;
    const { buttonStyle } = styles;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {orders.map((order) => {
          let price = order.order.coffeeDetail.startPrice;
          order.order.selection.map((item) => {
            price += item.items[0].plusPrice;
          });
          price *= order.order.productAmount;
          totalPrice += price;
          return this.renderItemWitDescription(
            order.order.coffeeDetail,
            order.order.selection,
            price.toFixed(2),
            order.order.uui,
            order.order.productAmount,
          );
        })}
        <LineSeparator />

        <OptionWithouDescriptionWrapper>
          <MediumText>Toplam</MediumText>
          <MediumText>{totalPrice.toFixed(2)}</MediumText>
        </OptionWithouDescriptionWrapper>

        <View
          style={buttonStyle}
        >
          <ButtonContent
            color={appStyles.colors.primaryColor}
            onPress={a => this.orderAction()}
          >
            <DefaultText>Sipariş Ver</DefaultText>
          </ButtonContent>
        </View>
      </ScrollView>
    );
  };

  componentWillReceiveProps(nextProps) {
    const { refreshHistory } = nextProps.coffee;
    const { requestHistory } = this.props;

    if (refreshHistory === true) {
      AsyncStorage.getItem('accessToken')
        .then((data) => {
          debugger;
          if (data) {
            requestHistory(data);
          }
        })
        .catch((err) => {});
    }
  }

  okButtonAfterSuccess() {
    const { refreshAll, navigation } = this.props;
    refreshAll();
    navigation.goBack(null);
    navigation.navigate(ROUTE_NAMES.MAIN_STACK);
    debugger;
  }
  renderText = (text1, text2) => (
    <OptionWithouDescriptionWrapper>
      <MediumTextBlack>{text1}</MediumTextBlack>
      <MediumText>{text2}</MediumText>
    </OptionWithouDescriptionWrapper>
  );

  renderIcon = () => (
    <Icon
      color={appStyles.colors.primaryColor}
      name="basket"
      size={50}
    />
  );
  renderNoOrderPage = history => (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <OptionWithouDescriptionWrapperHead>
        {this.renderIcon()}
        <MediumTextBlack>Sepetinizde ürün bulunmamaktadır.</MediumTextBlack>
        <LineSeparator />
      </OptionWithouDescriptionWrapperHead>

      {this.renderHistory(history)}
    </ScrollView>
  );

  renderHistory = (history) => {
    {
      if (history) {
        return (
          <View>
            <OptionWithouDescriptionWrapperHead>
              <MediumTextGreen>Önceki Siparişler</MediumTextGreen>
            </OptionWithouDescriptionWrapperHead>
            <LineSeparator />
            {history.history.map((item) => {
              let desc = '';
              item.orders.map((product) => {
                desc = `${desc + product.title} x${product.amount}, `;
              });
              desc = desc.substring(0, desc.length - 2);
              return (
                <View>
                  {this.renderItemWitDescriptionForHistory(
                    desc,
                    item.orderDate,
                    item.checkOutPrice,
                  )}
                  <LineSeparator />
                </View>
              );
            })}
          </View>
        );
      }
    }
  };

  renderSuccessOrderPage = (orderResult) => {
    const { buttonStyle } = styles;

    return (
      <View>
        <OptionWithouDescriptionWrapperHead>
          <MediumTextGreen>{orderResult.message}</MediumTextGreen>
        </OptionWithouDescriptionWrapperHead>
        <LineSeparator />
        {this.renderText('Sipariş Numarası: ', orderResult.orderId)}
        {this.renderText('Sipariş Tarihi: ', orderResult.orderTime)}
        {this.renderText('İrtibat Telefonu:', orderResult.contactNumber)}
        <LineSeparator />

        <View
          style={buttonStyle}
        >
          <ButtonContent
            color={appStyles.colors.primaryColor}
            onPress={a => this.okButtonAfterSuccess()}
          >
            <DefaultText>Tamam</DefaultText>
          </ButtonContent>
        </View>
      </View>
    );
  };

  render() {
    const {
      orders, loading, error, orderResult, history,
    } = this.props.coffee;

    return (
      <Container>
        {loading && <Loading />}
        {error && <Alert
          type={TYPES.ERROR_SERVER_CONNECTION}
        />}
        {orders.length > 0
          && !loading
          && !error
          && (!orderResult.responseCode || orderResult.responseCode === 0)
          && this.renderOrderCheckList(orders)}
        {!loading
          && !error
          && orderResult.responseCode
          && orderResult.responseCode === 100
          && this.renderSuccessOrderPage(orderResult)}
        {orders.length === 0
          && !orderResult.responseCode
          && !loading
          && !error
          && this.renderNoOrderPage(history)}
      </Container>
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
)(Orders);
const styles = {
  containerStyle: {
    paddingTop: 50,
  },
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
