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
import { Creators as AdminCreators } from '~/store/ducks/admin';
import {
  getBuildingByDistrict,
  getCities,
  getCompanyByBuilding,
  getDistrictByCity,
} from '~/services/APIUtils';
import appStyles from '~/styles';
import Loading from '~/components/common/Loading';
import { Alert, TYPES } from '~/components/common/alert';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonGroup } from 'react-native-elements';

import Firebase from 'firebase';
import { DefaultText } from '../login/components/Common';
import ButtonContent from '../login/components/ButtonContent';

const firebaseConfig = {
  apiKey: 'AIzaSyASMXtkE-aXVRkUH5_Z3DyFSxvrXlLRl0c',
  authDomain: 'espresgo-e742e.firebaseapp.com',
  databaseURL: 'https://espresgo-e742e.firebaseio.com',
  projectId: 'espresgo-e742e',
  storageBucket: 'espresgo-e742e.appspot.com',
  messagingSenderId: '667683830429',
  appId: '1:667683830429:web:8845970158a0d835597274',
  measurementId: 'G-HKCDVNZBJZ',
};

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
const OptionTextWrapperBackGround = styled(View)`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lightGray};
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

class Admin extends Component<Props, State> {
  constructor(props) {
    super(props);
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    }
    this.selectOrder = this.selectOrder.bind(this);

    this.updateSelectedOrderStatus = this.updateSelectedOrderStatus.bind(this);
    this.updateSelectedOrderStatusDetail = this.updateSelectedOrderStatusDetail.bind(
      this,
    );

    this.state = {
      update: false,
      orderList: [],
      orderListSynch: [],
      token: {},
      detailPage: false,
      detailOrder: {},
      selectedOrderStatus: 0,
      selectedOrderStatusDetail: 0,
      orderListFirebase: [],
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem('accessToken')
      .then((token) => {
        if (token) {
          const { isOrderClosed } = this.props;

          isOrderClosed(token);
          this.setState({
            token: data,
          });
        }
      })
      .catch((err) => {});

    Firebase.database()
      .ref('espresgo-test/order/')
      .on('child_added', (snapshot, prevChildKey) => {
        this.setState({
          orderListFirebase: [...this.state.orderListFirebase, snapshot.val()],
        });
      });

    Firebase.database()
      .ref('espresgo-test/order/')
      .on('child_changed', (snapshot) => {
        this.setState((state) => {
          const orderListFirebase = state.orderListFirebase.filter(
            item => item.orderUid !== snapshot.val().orderUid,
          );
          orderListFirebase.push(snapshot.val());
          return {
            orderListFirebase,
          };
        });
      });

    Firebase.database()
      .ref('espresgo-test/order/')
      .on('child_removed', (snapshot) => {
        this.setState((state) => {
          const orderListFirebase = state.orderListFirebase.filter(
            item => item.orderUid !== snapshot.val().orderUid,
          );
          return {
            orderListFirebase,
          };
        });
      });
  }

  componentWillUnmount() {
    // clearInterval(this.interval);

    this.setState({
      detailPage: false,
    });
  }

  renderItemWitDescription = (title, selection, price, amount) => (
    <ItemWrapper>
      <OptionWrapper>
        {this.renderOptionWithDescription(title, selection, amount)}
        <SectionTitleText>{price}</SectionTitleText>
      </OptionWrapper>
    </ItemWrapper>
  );

  renderPersonInfo = (name, phone, email) => (
    <ItemWrapper>
      <OptionWrapper>
        <OptionTextWrapperBackGround>
          <MediumText>Kişi Bilgisi</MediumText>
          <SmallText>
            {' '}
            {`İsim: ${name}`}
          </SmallText>
          <SmallText>
            {' '}
            {`Telefon: ${phone}`}
          </SmallText>
          <SmallText>
            {' '}
            {`Email: ${email}`}
          </SmallText>
        </OptionTextWrapperBackGround>
      </OptionWrapper>
    </ItemWrapper>
  );

  renderAddressInfo = (addressInfo) => {
    let address = '';
    if (addressInfo) {
      if (addressInfo.city) address = `${address + addressInfo.city.name}-`;

      if (addressInfo.district) {
        address = `${address + addressInfo.district.name}-`;
      }

      if (addressInfo.building) {
        address = `${address + addressInfo.building.name}-`;
      }

      if (addressInfo.company) address += addressInfo.company.name;
    }

    return (
      <ItemWrapper>
        <OptionWrapper>
          <OptionTextWrapperBackGround>
            <MediumText>Adres Bilgisi</MediumText>
            <SmallText>
              {' '}
              {`Bina :${address}`}
            </SmallText>
            <SmallText>
              {' '}
              {'Detay :-'}
            </SmallText>
          </OptionTextWrapperBackGround>
        </OptionWrapper>
      </ItemWrapper>
    );
  };

  renderItemWitDescriptionForHistory = (date, items, price, address) => (
    <ItemWrapper>
      <OptionWrapper>
        {this.renderOptionWithDescriptionForHistory(date, items, address)}
        <SectionTitleText>{price}</SectionTitleText>
      </OptionWrapper>
    </ItemWrapper>
  );

  renderOptionWithDescriptionForHistory = (
    title: string,
    description: string,
    address: string,
  ): Object => (
    <OptionTextWrapper>
      <MediumText>{title}</MediumText>
      <SmallText>{description}</SmallText>
      <SmallText>{address}</SmallText>
    </OptionTextWrapper>
  );

  renderOptionWithDescription = (title, selection, amount) => (
    <OptionTextWrapper>
      <MediumText>{title}</MediumText>
      {selection.map(item => (
        <SmallText>
          {`${item.selection.label}: ${item.selectionItem.itemName}`}
        </SmallText>
      ))}
      <SmallText>{`Adet:  X${amount}`}</SmallText>
    </OptionTextWrapper>
  );

  renderOrderCheckList = (orders) => {
    let price = 0.0;
    const { buttonStyle } = styles;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {orders[0].orders.map((order) => {
          price = order.totalPrice;
          if (price > 0) {
            price = price.toFixed(2);
          }
          return this.renderItemWitDescription(
            order.title,
            order.selection,
            price,
            order.amount,
          );
        })}
        <LineSeparator />

        <OptionWithouDescriptionWrapper>
          <MediumText>Toplam</MediumText>
          <MediumText>{orders[0].checkOutPrice.toFixed(2)}</MediumText>
        </OptionWithouDescriptionWrapper>
      </ScrollView>
    );
  };

  selectOrder = (orderUid) => {
    const { getOrderByUid } = this.props;

    AsyncStorage.getItem('accessToken')
      .then((token) => {
        if (token) {
          getOrderByUid(orderUid, token);
        }
      })
      .catch((err) => {});

    this.setState({
      detailPage: true,
    });
  };

  closeOrder = () => {
    const { closeOrder, isOrderClosed } = this.props;
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        if (data) {
          closeOrder(data);
          this.setState({
            token: data,
          });
        }
      })
      .catch((err) => {});
  };

  openOrder = () => {
    const { openOrder, isOrderClosed } = this.props;
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        if (data) {
          openOrder(data);
          this.setState({
            token: data,
          });
        }
      })
      .catch((err) => {});
  };

  renderDetail = () => {
    const { detailOrder } = this.state;
    const { user, address, statusId } = detailOrder[0];
    return (
      <View>
        {this.renderBackButton()}
        {this.renderOrderStatusButtonDetail(statusId)}

        {this.renderOrderCheckList(detailOrder)}
        {user && this.renderPersonInfo(user.name, user.username, user.email)}
        {address && this.renderAddressInfo(address)}
      </View>
    );
  };

  renderBackButton = () => (
    <ButtonContent
      color={appStyles.colors.primaryColor}
      onPress={a => this.setState({ detailPage: false })}
    >
      <DefaultText>Geri</DefaultText>
    </ButtonContent>
  );

  renderCloseOrderButton = () => (
    <ButtonContent
      color={appStyles.colors.primaryColor}
      onPress={a => this.closeOrder()}
    >
      <DefaultText>Siparis Alımını Kapat</DefaultText>
    </ButtonContent>
  );

  renderOpenOrderButton = () => (
    <ButtonContent
      color={appStyles.colors.primaryColor}
      onPress={a => this.openOrder()}
    >
      <DefaultText>Siparis Alımını Aç</DefaultText>
    </ButtonContent>
  );

  setLocationButton = () => (
    <ButtonContent
      color={appStyles.colors.primaryColor}
      onPress={a => this.setLocation()}
    >
      <DefaultText>Konumu İşaretle</DefaultText>
    </ButtonContent>
  );

  renderOrderStatusButton = () => {
    const buttons = ['Yeni', 'Alındı', 'Gönderildi', 'Teslim'];
    const { selectedOrderStatus } = this.state;
    return (
      <ButtonGroup
        onPress={this.updateSelectedOrderStatus}
        selectedIndex={selectedOrderStatus}
        buttons={buttons}
        containerStyle={{ height: 50, weight: 100 }}
      />
    );
  };

  renderOrderStatusButtonDetail = (currentOrderStatus) => {
    const buttons = ['Yeni', 'Alındı', 'Gönderildi', 'Teslim'];
    return (
      <ButtonGroup
        onPress={this.updateSelectedOrderStatusDetail}
        selectedIndex={currentOrderStatus}
        buttons={buttons}
        containerStyle={{ height: 50, weight: 100 }}
      />
    );
  };

  updateSelectedOrderStatus(selectedOrderStatus) {
    this.setState({ selectedOrderStatus });
  }

  updateSelectedOrderStatusDetail(selectedOrderStatusDetail) {
    const { detailOrder } = this.state;
    const { updateOrderStatus } = this.props;
    const detailOrderObject = detailOrder[0];
    const detailOrderList = [];
    detailOrderObject.statusId = selectedOrderStatusDetail;
    detailOrderList.push(detailOrderObject);

    this.setState({
      detailOrder: detailOrderList,
      selectedOrderStatusDetail,
    });
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        if (data) {
          updateOrderStatus(
            detailOrder[0].orderUid,
            selectedOrderStatusDetail,
            data,
          );
        }
      })
      .catch((err) => {});
  }

  setLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // user location's latitude and longitude
        const latitude = parseFloat(position.coords.latitude);
        const longitude = parseFloat(position.coords.longitude);

        const vehicleLocationRto = {
          latitude,
          longitude,
        };

        AsyncStorage.getItem('accessToken')
          .then((data) => {
            if (data) {
              const { setLocation } = this.props;
              setLocation(latitude, longitude, data);
            }
          })
          .catch((err) => {});
      },
      error => console.log('position error!!!', error),
      { enableHighAccuracy: true, timeout: 30000 },
    );
  };

  renderIcon = () => (
    <Icon
      color={appStyles.colors.primaryColor}
      name="basket"
      size={50}
    />
  );

  renderAllOrder = (allOrder, orderClosed) => {
    {
      if (allOrder) {
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {allOrder.map(item => (
              <View>
                <TouchableOpacity
                  onPress={() => this.selectOrder(item.orderUid)}
                >
                  {this.renderItemWitDescriptionForHistory(
                    item.orderItemNames,
                    item.orderDate,
                    '',
                    item.addessText,
                  )}
                </TouchableOpacity>
                <LineSeparator />
              </View>
            ))}
          </ScrollView>
        );
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.admin.orderDetail.data
      && nextProps.admin.orderDetail.data.history
    ) {
      this.setState({
        detailOrder: nextProps.admin.orderDetail.data.history,
      });
    }
  }

  render() {
    const { buttonStyle, subButtonStyle } = styles;

    const { loading, error, orderClosed } = this.props.admin;
    const { orderListFirebase, selectedOrderStatus } = this.state;

    let orderList = [];

    if (orderListFirebase.length > 0) {
      orderList = orderListFirebase.filter(
        item => parseInt(item.status) === selectedOrderStatus,
      );
    }

    return (
      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {loading && <Loading />}
          {error && <Alert
            type={TYPES.ERROR_SERVER_CONNECTION}
          />}

          <View
            style={buttonStyle}
          >
            <View
              style={subButtonStyle}
            >
              {!this.state.detailPage && this.setLocationButton()}
            </View>
            <View
              style={subButtonStyle}
            >
              {!this.state.detailPage
                && orderClosed
                && orderClosed.data
                && this.renderOpenOrderButton()}
              {!this.state.detailPage
                && orderClosed
                && !orderClosed.data
                && this.renderCloseOrderButton()}
            </View>
          </View>

          {!this.state.detailPage && this.renderOrderStatusButton()}

          {!this.state.detailPage
            && !loading
            && !error
            && orderList.length > 0
            && this.renderAllOrder(orderList, orderClosed)}

          {this.state.detailPage
            && this.state.detailOrder.length > 0
            && !loading
            && !error
            && this.renderDetail()}
        </ScrollView>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(AdminCreators, dispatch);
const mapStateToProps = state => ({
  admin: state.admin,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin);
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
  subContainerStyle: {
    paddingTop: 10,
  },

  buttonStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subButtonStyle: {
    flex: 1,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 8,
  },
};
