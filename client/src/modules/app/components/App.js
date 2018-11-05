import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Footer from './Footer';
import home from '../../home';
import login from '../../login';
import forgotPassword from '../../forgotpassword';
import NotFound from './NotFound';
import NavigationBar from './NavigationBar';

import { Link, withRouter } from "react-router-dom";

import styles from '../../../styles/app.css';

const { Home } = home;
const { Login } = login;
const { ForgotPassword} = forgotPassword;
const App = ({ store }) => (
  <Provider store={store}>
    <Router>

      <Container id="container" >
        <div className="app" >
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer/>

        </div>
        <NavigationBar  header_text="Sipuliton.fi"/>
      </Container>

    </Router>
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
