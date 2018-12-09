import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../../../styles/login.css';
import { Auth } from 'aws-amplify';

import LoginForm from './Login_Form.js'
import SocialLogin from './Social_Login.js'

/* Localization */
import LocalizedStrings from 'react-localization';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInAlready: false,
    };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
        .then(user => {
          this.setState({loggedInAlready: true});
        })
        .catch(err => {});
  }

  render() {
    if (this.state.loggedInAlready) {
      return <Redirect to={"/" + this.props.match.params.language + "/profile"} />
    }

    let strings = new LocalizedStrings({
      en:{
        forgotpassword:"Forgot password?",
        login:"Login",
        notRegisteredYet:"Not registered yet?",
        registerNow:"Register now!",
        or:"Or",
      },
      fi: {
        forgotpassword:"Unohditko salasanasi?",
        login:"Kirjautuminen",
        notRegisteredYet:"Etkö ole vielä rekisteröitynyt?",
        registerNow:"Rekisteröidy nyt!",
        or:"Tai",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    /* URL paths */
    const pathToRegister = '/' + this.props.match.params.language + '/register/';
    const pathToForgotPassword = '/' + this.props.match.params.language + '/forgot-password/';

    return(
      <div id="login" className="max-w-40">
        <h2>{strings.login}</h2>
        <LoginForm language={this.props.match.params.language}/> 
        <div className="social-login-container">
          <h5>{strings.or}</h5>
          <SocialLogin language={this.props.match.params.language}/> 
        </div>
        
        <span>{strings.notRegisteredYet} </span>
        <Link to={pathToRegister}>
          {strings.registerNow}
        </Link>
        <br/>
        <Link to={pathToForgotPassword}>
          {strings.forgotpassword}
        </Link>
      </div>
    );
  }
}




export default Login;
