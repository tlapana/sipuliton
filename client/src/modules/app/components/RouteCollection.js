import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import home from '../../home';
import login from '../../login';
import register from '../../register';
import forgotPassword from '../../forgotpassword';
import profile from '../../profile';
<<<<<<< HEAD
import map from '../../map'
=======
import restaurant from '../../restaurant';

>>>>>>> 802c4d379fea4a70e504caa008bf18c37b8d850a
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
    const { ForgotPassword } = forgotPassword;
    const { Profile } = profile;
<<<<<<< HEAD
    const { Map } = map;
=======
	  const { Restaurant } = restaurant;

>>>>>>> 802c4d379fea4a70e504caa008bf18c37b8d850a
    return (
      <Switch>
        <Redirect exact from="/" to="/fi" />
        <Route exact path="/:language" component={Home} />
        <Route path="/:language/login/" component={Login} />
        <Route path="/:language/register/" component={Register} />
        <Route path="/:language/forgot-password/" component={ForgotPassword} />
        <Route path="/:language/userProfile/" component={Profile} />
<<<<<<< HEAD
        <Route path="/:language/map/" component={Map} />

=======
        <Route path="/:language/restaurant/:id" component={Restaurant} />
>>>>>>> 802c4d379fea4a70e504caa008bf18c37b8d850a
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default RouteCollection;
