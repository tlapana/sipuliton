import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';

import { containers as AppContainers } from './modules/app';
import rootReducer from './rootReducer';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import withAuthenticator from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.css';
import './fontawesome';  // this is our font awesome library


import config from './config';
import LoginApi from './modules/login/components/LoginGlobalFunctions'

LoginApi.configure(config);

const { AppContainer } = AppContainers;
const store = createStore(rootReducer);
withAuthenticator(AppContainer);

render(
  <AppContainer store={store} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
