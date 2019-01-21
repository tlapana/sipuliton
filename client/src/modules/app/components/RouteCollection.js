import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import home from '../../home';
import login from '../../login';
import register from '../../register';
import forgotPassword from '../../forgotpassword';
import profile from '../../profile';
import Review  from '../../MyReview/components/MyReview';
import myReviewEdit1  from '../../MyReview/components/myReviewsEdit';
import about from '../../about';
import map from '../../map'
import Review from '../../myReviews'
import myReviewEdit1 from '../../myReviews/components/Review/myReviewsEdit'
import restaurant from '../../restaurant';
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
    const { Map } = map;
	  const { Restaurant } = restaurant;
    const { About } = about;
    return (
      <Switch>
        <Redirect exact from="/" to="/fi" />
        <Route exact path="/:language" component={Home} />
        <Route path="/:language/login/" component={Login} />
        <Route path="/:language/register/" component={Register} />
        <Route path="/:language/forgot-password/" component={ForgotPassword} />
        <Route path="/:language/profile/" component={Profile} />
        <Route path="/:language/map/:searchParameters" component={Map} />
        <Route path="/:language/map" component={Map} />
<<<<<<< HEAD
        <Route path="/:language/myReview" component={Review} />
        <Route path="/:language/myReviewEdit" component={myReviewEdit1 } />

=======
        <Route path="/:language/myReviews" component={Review} />
        <Route path="/:language/myReviewEdit" component={myReviewEdit1} />
>>>>>>> 7ad5105a9a93bcf16c5f27ba44f8197f7e7aaf4e
        <Route path="/:language/restaurant/:id" component={Restaurant} />
        <Route path="/:language/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default RouteCollection;
