import React from 'react';
import { Route, Switch } from 'react-router-dom';

import home from '../../home';
import login from '../../login';
import register from '../../register';
import forgotPassword from '../../forgotpassword';

import NotFound from './NotFound';

const { Home } = home;
const { Login } = login;
const { Register } = register;
const { ForgotPassword} = forgotPassword;



class RouteCollection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default RouteCollection;
