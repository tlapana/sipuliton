import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Footer from './Footer';
import home from '../../home';
import login from '../../login';
import NotFound from './NotFound';
import NavigationBar from './NavigationBar'
const { Home } = home;
const { Login } = login;

const App = ({ store }) => (
  <Provider store={store}>
    <Router>

      <Container>
        <div className="app">
          <NavigationBar/>


          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />

              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Container>

    </Router>
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
