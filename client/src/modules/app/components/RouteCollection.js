import React from 'react';
import { Route, Switch } from 'react-router-dom';

import home from '../../home';
import login from '../../login';
import register from '../../register';
import forgotPassword from '../../forgotpassword';

import NotFound from './NotFound';

/* This is where all routes should be */
class RouteCollection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { Home } = home;
    const { Login } = login;
    const { Register } = register;
    const { ForgotPassword} = forgotPassword;

    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:language" component={Home} />
        <Route path="/:language/login/" component={Login} />
        <Route path="/:language/register/" component={Register} />
        <Route path="/:language/forgot-password/" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default RouteCollection;
