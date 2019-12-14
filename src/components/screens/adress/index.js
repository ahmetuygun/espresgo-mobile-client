// @flow

import React, {Component} from 'react';
import {AsyncStorage, ScrollView, StyleSheet, View} from 'react-native';
import styled from 'styled-components';
import Loading from '~/components/common/Loading';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Creators as AddressCreators} from '~/store/ducks/adress';
import {persistItemInStorage} from '~/utils/AsyncStoarageManager';
import appStyles from '~/styles';
import {Alert, TYPES} from '~/components/common/alert';
import {ROUTE_NAMES} from '../../../routes';
import {getBuildingByDistrict, getCities, getCompanyByBuilding, getDistrictByCity} from '~/services/APIUtils';
import ButtonContent from "../login/components/ButtonContent";
import {DefaultText} from "../login/components/Common";
import {TextField} from 'react-native-material-textfield';
import {Dropdown} from 'react-native-material-dropdown';

const Container = styled(View)`
  flex: 1;
  padding: ${({theme}) => theme.metrics.mediumSize}px;
  background-color: ${({theme}) => theme.colors.white};
  margin: ${({theme}) => theme.metrics.mediumSize}px;
`;


export const ButtonsContentContainer = styled(View)`
  margin: ${({theme}) => theme.metrics.smallSize}px;
`;

class Address extends Component<Props, State> {

  constructor(props) {
    super(props);
    this.selectCity = this.selectCity.bind(this);
    this.selectDistrict = this.selectDistrict.bind(this);
    this.selectBuilding = this.selectBuilding.bind(this);
    this.selectCompany = this.selectCompany.bind(this);


    this.state = {
      update: false,
      cities: [],
      districts: [],
      buildings: [],
      companies: [],
      selectedCity: {
        name: '',
        id: ''
      },
      selectedDistrict: {
        name: '',
        id: ''
      },
      selectedBuilding: {
        name: '',
        id: ''
      },
      selectedCompany: {
        name: '',
        id: ''
      },
      name: '',
      phone: '',
      email: '',
      addressDesciption : ''
    }
  };


  selectCity(value, index, data) {

    this.setState({
      selectedCity: {
        ...this.state.selectedCity,
        name: data.filter(filterItem => filterItem.id === value).name,
        id: value
      },
      selectedDistrict: {
        ...this.state.selectedDistrict,
        name: '',
        id: ''
      },
      selectedBuilding: {
        ...this.state.selectedBuilding,
        name: '',
        id: ''
      },
      selectedCompany: {
        ...this.state.selectedCompany,
        name: '',
        id: ''
      }
    })

    getDistrictByCity(value)
      .then(response => {
        this.setState({
          districts: response.list
        })
      }).catch(error => {

    });

  }

  selectDistrict(value, index, data) {
    this.setState({
      selectedDistrict: {
        ...this.state.selectedDistrict,
        name: data.filter(filterItem => filterItem.id === value).name,
        id: value
      },
      selectedBuilding: {
        ...this.state.selectedBuilding,
        name: '',
        id: ''
      }, selectedCompany: {
        ...this.state.selectedCompany,
        name: '',
        id: ''
      }
    })


    getBuildingByDistrict(value)
      .then(response => {
        this.setState({
          buildings: response.list
        })
      }).catch(error => {

    });
  }

  selectBuilding(value, index, data) {
    this.setState({
      selectedBuilding: {
        ...this.state.selectedBuilding,
        name: data.filter(filterItem => filterItem.id === value).name,
        id: value
      },
      selectedCompany: {
        ...this.state.selectedCompany,
        name: '',
        id: ''
      }
    })


    getCompanyByBuilding(value)
      .then(response => {
        this.setState({
          companies: response.list
        })
      }).catch(error => {

    });

  }

  selectCompany(value, index, data) {
    this.setState({
      selectedCompany: {
        ...this.state.selectedCompany,
        name: data.filter(filterItem => filterItem.id === value).name,
        id: value
      }
    })
  }

  registerAddress(a) {
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        if (data) {
          const {registerAdress} = this.props;
          registerAdress(this.state.selectedCity.id,
            this.state.selectedDistrict.id,
            this.state.selectedBuilding.id,
            this.state.selectedCompany.id,
            this.state.name,
            this.state.phone,
            this.state.email,
            this.state.addressDesciption,
            data);

          this.setState({
            update: true
          })
        }
      })
      .catch((err) => {
      })

  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.update === false && nextState.update === true) {
      const {getUserDetail} = this.props;
      AsyncStorage.getItem('accessToken')
        .then((data) => {
          if (data) {
            getUserDetail(data);
            this.setState({
              update: false
            })
          }
        })
        .catch((err) => {
        })
    }
  }

  componentDidMount() {

    const {getUserDetail} = this.props;
    AsyncStorage.getItem('accessToken')
      .then((data) => {
        if (data) {
          getUserDetail(data);
        }
      })
      .catch((err) => {
      })


    getCities()
      .then(response => {
        this.setState({
          cities: response.list
        })
      }).catch(error => {

    });

  }

  componentWillReceiveProps(nextProps) {

    const {registered, loading, userDetail} = nextProps.adress;
    if (!loading && registered) {
      const {navigation} = this.props;
      navigation.navigate(ROUTE_NAMES.MAIN_STACK)
    }

    if (!loading && userDetail.userPrincipal) {

      this.setState({
        name: userDetail.userPrincipal.name,
        phone: userDetail.userPrincipal.username,
        email: userDetail.userPrincipal.email
      })
    }

    if (!loading && userDetail.address) {

      this.setState({
        selectedCity: {
          ...this.state.selectedCity,
          name: userDetail.address.city.name,
          id: userDetail.address.city.id
        },
        selectedDistrict: {
          ...this.state.selectedDistrict,
          name: userDetail.address.district.name,
          id: userDetail.address.district.id
        },
        selectedBuilding: {
          ...this.state.selectedBuilding,
          name: userDetail.address.building.name,
          id: userDetail.address.building.id
        },
        selectedCompany: {
          ...this.state.selectedCompany,
          name: userDetail.address.company.name,
          id: userDetail.address.company.id
        },
        addressDesciption: userDetail.address.addressDesciption


      })

    }
  }


  renderDropDown = (
    dataSource,
    label,
    selectedName,
    selectFunction: function
  ): Object => (
    <Dropdown
      value={selectedName.name}
      onChangeText={selectFunction}
      label={label}
      valueExtractor={({id}) => id}
      labelExtractor={({name}) => name}
      data={dataSource}
    />

  );


  renderSaveButton = () => {
    return (

      <ButtonContent
        color={appStyles.colors.primaryColor}
        onPress={(a) => this.registerAddress(a)}>
        <DefaultText>Kaydet</DefaultText>
      </ButtonContent>

    );
  };

  renderSignOutButton = () => {

    return (

      <ButtonContent
        color={appStyles.colors.primaryColor}
        onPress={(a) => this.signOut(a)}>
        <DefaultText>Çıkış Yap</DefaultText>
      </ButtonContent>

    );
  };

  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  signOut(a) {

    this.removeItemValue('accessToken')
    this.removeItemValue('splashScreen')

    const {navigation} = this.props;
    navigation.navigate(ROUTE_NAMES.ONBOARDING_INTRO)
  }


  renderMain(){

    const {
      buttonStyle, subButtonStyle
    } = Styles;

    return(
      <ScrollView showsVerticalScrollIndicator={false} >
        <TextField
          label='İsim'
          value={this.state.name}
          onChangeText={(name) => this.setState({name})}
        />
        <TextField
          label='Email'
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
        />

        <TextField
          label='Telefon' disabled={true}
          value={this.state.phone}
          onChangeText={(phone) => this.setState({phone})}
        />

        {this.renderDropDown(this.state.cities, '(1)Şehir Seçimi', this.state.selectedCity, this.selectCity)}
        {this.renderDropDown(this.state.districts, '(2)Ilçe Seçimi', this.state.selectedDistrict, this.selectDistrict)}


        {this.renderDropDown(this.state.buildings, '(3)Plaza Seçimi ', this.state.selectedBuilding, this.selectBuilding)}
        {this.renderDropDown(this.state.companies, '(4)Şirket Seçimi ', this.state.selectedCompany, this.selectCompany)}

        <TextField
          label='Kat, Birim, Açıklama vs' disabled={false}
          value={this.state.addressDesciption}
          onChangeText={(addressDesciption) => this.setState({addressDesciption})}
        />

        <ButtonsContentContainer>
          <View style={buttonStyle}>
            <View style={subButtonStyle}>
              {this.renderSaveButton()}
            </View>
            <View style={subButtonStyle}>
              {this.renderSignOutButton()}
            </View>
          </View>
        </ButtonsContentContainer>
      </ScrollView>
    )

  }

  render() {

    const { loading, error } = this.props.adress;

    return (
      <Container>

        {loading && <Loading />}
        {error && <Alert
          type={TYPES.ERROR_SERVER_CONNECTION}  />}

        {!loading
        && !error && this.renderMain()}

      </Container>
    );

  }
}


const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10
  },

  selectLabelTextStyle: {
    color: "#000",
    textAlign: "left",
    width: "99%",
    padding: 10,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "#000",
    padding: 10,
    textAlign: "left",
    width: "99%",
    flexDirection: "row"
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: "center"
  },

  pickerStyle: {
    marginLeft: 18,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1
    },
    borderWidth: 1,
    shadowRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 5,
    flexDirection: "row"
  },
  buttonStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subButtonStyle: {
    flex: 1,
    paddingLeft : 3,
    paddingRight : 3,
    paddingTop: 8
  },
});
const mapDispatchToProps = dispatch => bindActionCreators(AddressCreators, dispatch);
const mapStateToProps = state => ({
  adress: state.adress,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Address);
