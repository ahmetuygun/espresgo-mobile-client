import { API_BASE_URL, ACCESS_TOKEN } from '~/services/api';
import { AsyncStorage } from 'react-native';

export const request = (options, accessToken) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (accessToken) headers.append('Authorization', `Bearer ${accessToken}`);

  const defaults = { headers };
  options = Object.assign({}, defaults, options);

  const fetchResult = fetch(options.url, options).then(response => response.json().then((json) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  }));

  return fetchResult;
};

export async function checkUsernameAvailability(username) {
  return request({
    url: `${API_BASE_URL}/user/checkUsernameAvailability?username=${username}`,
    method: 'GET',
  });
}

export async function checkEmailAvailability(email) {
  return request({
    url: `${API_BASE_URL}/user/checkEmailAvailability?email=${email}`,
    method: 'GET',
  });
}

export function getCurrentUser(accessToken) {
  return request({
    url: `${API_BASE_URL}/user/me`,
    method: 'GET',
  },accessToken);
}

export function getUserInfo() {
  return request({
    url: `${API_BASE_URL}/getUserInfo`,
    method: 'GET',
  });
}

export function getUserProfile(username) {
  return request({
    url: `${API_BASE_URL}/users/${username}`,
    method: 'GET',
  });
}

export function getCities() {
  return request({
    url: `${API_BASE_URL}/address/getCities/`,
    method: 'GET',
  });
}
export function getDistrictByCity(cityId) {
  return request({
    url: `${API_BASE_URL}/address/getDistrictByCity?cityId=${cityId}`,
    method: 'GET',
  });
}
export function getBuildingByDistrict(distirictId) {
  return request({
    url: `${API_BASE_URL}/address/getBuildingByDistrict?distirictId=${distirictId}`,
    method: 'GET',
  });
}
export function getCompanyByBuilding(buildingId) {
  return request({
    url: `${API_BASE_URL}/address/getCompanyByBuilding?buildingId=${buildingId}`,
    method: 'GET',
  });
}

export async function activeteUser(otp, to) {
  return request({
    url: `${API_BASE_URL}/auth/activateUser?otp=${otp}&to=${to}`,
    method: 'GET',
  });
}

export async function sendCode(to) {
  return request({
    url: `${API_BASE_URL}/auth/sendCode?to=${to}`,
    method: 'GET',
  });
}

export function hasAddress(accessToken) {
  return request(
    {
      url: `${API_BASE_URL}/user/hasAddress`,
      method: 'GET',
    },
    accessToken,
  );
}

export function isAdmin(accessToken) {
  return request(
    {
      url: `${API_BASE_URL}/user/isAdmin`,
      method: 'GET',
    },
    accessToken,
  );
}
