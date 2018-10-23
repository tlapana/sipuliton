import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';

import App from './modules/app/components/App';
import rootReducer from './rootReducer';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import './fontawesome';  // this is our font awesome library



const store = createStore(rootReducer);



render(
  <App store={store} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
