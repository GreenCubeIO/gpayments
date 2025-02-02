'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const assert = require('assert');
const axios = require('axios');
const getToken = require('./token');

var _require = require('./config');

const CLIENT_ID = _require.CLIENT_ID,
      CLIENT_SECRET = _require.CLIENT_SECRET,
      API_URL = _require.API_URL;


const onSuccess = res => res.data;
const onError = error => error.response && error.response.data ? Promise.reject(error.response.data.detail || error.response.data) : Promise.reject(error.response || error.message);

const methods = ['get', 'put', 'post', 'patch', 'delete'];

module.exports = ({ clientId, clientSecret } = { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }) => {
  assert(clientId, 'Client ID is missing. Please pass a clientId as parameter or set the GPAYMENTS_CLIENT_ID environment variable.');
  assert(clientSecret, 'Client secret is missing. Please pass a clientSecret as parameter or set the GPAYMENTS_CLIENT_SECRET environment variable.');

  const getAccessToken = getToken(clientId, clientSecret);
  const client = axios.create({ baseURL: `${API_URL}/v1` });

  client.defaults.headers.common['Content-Type'] = 'application/json';
  client.interceptors.request.use((() => {
    var _ref = _asyncToGenerator(function* (config) {
      const accessToken = yield getAccessToken();
      config.headers.Authorization = `bearer ${accessToken}`;
      return config;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());

  var _methods$map = methods.map(method => (...args) => client[method](...args).then(onSuccess).catch(onError)),
      _methods$map2 = _slicedToArray(_methods$map, 5);

  const get = _methods$map2[0],
        put = _methods$map2[1],
        post = _methods$map2[2],
        patch = _methods$map2[3],
        del = _methods$map2[4];


  const me = {
    fetch: () => get('/accounts/me/'),
    update: data => put('/accounts/me/', data)
  };

  const customers = {
    create: data => post('/accounts/customers/', data),
    fetch: key => key ? get(`/accounts/customer/${key}/`) : get('/accounts/customers/'),
    update: (key, data) => patch(`/accounts/customer/${key}/`, data),
    remove: key => del(`/accounts/customer/${key}/`)
  };

  const charges = {
    create: (data = {}) => 'customer_key' in data ? post('/charges/create/', data) : post('/charges/simple/create/', data),
    logs: id => id ? get(`/charges/logs/${id}/`) : get('/charges/logs/')
  };

  const plans = {
    fetch: key => key ? get(`/plans/mine/${key}/`) : get('/plans/mine/'),
    create: data => post('/plans/create/', data),
    remove: key => del(`/plans/mine/${key}/`)
  };

  const subscriptions = {
    subscribe: data => post('/plans/subscribe/', data),
    unsubscribe: id => del('/plans/un-subscribe/', { data: { subscription_id: id } }),
    fetch: id => id ? get(`/plans/subscription/${id}/`) : get('/plans/subscriptions/')
  };

  return { me, plans, charges, customers, subscriptions };
};