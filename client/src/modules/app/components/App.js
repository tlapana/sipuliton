import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Footer from './Footer';
import home from '../../home';
import login from '../../login';
import register from '../../register';
import forgotPassword from '../../forgotpassword';
import NotFound from './NotFound';
import NavigationBar from './NavigationBar';

import { Link, withRouter, Redirect } from "react-router-dom";

import styles from '../../../styles/app.css';


class App extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
  }

  render() {
    const { Home } = home;
    const { Login } = login;
    const { Register } = register;
    const { ForgotPassword} = forgotPassword;
    return(
      <Provider store={this.props.store}>
        <Router>
          <Container id="container" >
            <div className="app" >
              <div className="content">
                <Switch>
                  <Route exact path="/:language" component={Home} />
                  <Route path="/login/:language" component={Login} />
                  <Route path="/register/:language" component={Register} />
                  <Route path="/forgot-password/:language" component={ForgotPassword} />
                  <Route component={NotFound} />
                </Switch>
              </div>
              <Footer/>
            </div>
            <NavigationBar  header_text="Sipuliton.fi"/>
          </Container>
        </Router>
      </Provider>
    )
  }

}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
