import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import home from '../../home';
import login from '../../login';
import register from '../../register';
import forgotPassword from '../../forgotpassword';
import profile from '../../profile';

import NotFound from './NotFound';

/* This is where all routes should be */
class RouteCollection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { Home } = home;
    const { Login, Logout } = login;
    const { Register } = register;
    const { ForgotPassword } = forgotPassword;
    const { EditProfile, Profile } = profile;

    return (
      <Switch>
        <Redirect exact from="/" to="/fi" />
        <Route exact path="/:language" component={Home} />
        <Route path="/:language/login/" component={Login} />
        <Route path="/:language/logout/" component={Logout} />
        <Route path="/:language/register/" component={Register} />
        <Route path="/:language/forgot-password/" component={ForgotPassword} />
        <Route path="/:language/profile/" component={Profile} />
        <Route path="/:language/profile/:id/" component={Profile} />
        <Route path="/:language/edit-profile/" component={EditProfile} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default RouteCollection;
