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
import write_review from '../../writereview';

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
    const { WriteReview} = write_review;
    return(
      <Provider store={this.props.store}>
        <Router>
          <Container id="container" >
            <div className="app" >
              <div className="content">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/:language" component={Home} />
                  <Route path="/:language/login/" component={Login} />
                  <Route path="/:language/register/" component={Register} />
                  <Route path="/:language/forgot-password/" component={ForgotPassword} />
                  <Route path="/:language/writereview/:restaurantID" component={WriteReview} />
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
