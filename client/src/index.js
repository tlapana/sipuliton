import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';

import AppContainer from './modules/app/containers/AppContainer';
import rootReducer from './rootReducer';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import withAuthenticator from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.css';
import './fontawesome';  // this is our font awesome library


import config from './config';


Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  federated: {
    google_client_id: config.google.CLIENT_ID,
    facebook_app_id: '',
    amazon_client_id: ''
  }
});

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
