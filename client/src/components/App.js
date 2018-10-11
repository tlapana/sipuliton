import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import NotFound from './NotFound';


const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <div className="app">
        <header className="header">
          <h1>Sipuliton</h1>
        </header>

        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </div>

        <Footer />
      </div>
    </Router>
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
