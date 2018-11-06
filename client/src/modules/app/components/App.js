import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import RouteCollection from './RouteCollection';
import NavigationBar from './NavigationBar';

import '../../../styles/app.css';


const App = ({ store }) => (
  <Provider store={store}>
    <Router>

      <div className="app theme-1" >
        <div className="content">
          <Container className="main-content">
            <RouteCollection/>
          </Container>
          <NavigationBar header_text="Sipuliton.fi"/>
        </div>
      </div>

    </Router>
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
