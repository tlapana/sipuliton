import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink, } from 'reactstrap';
import '../../../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoginForm from './Login_Form.js'
import SocialLogin from './Social_Login.js'

/* Localization */
import LocalizedStrings from 'react-localization';

class Login extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
  }
  render() {
    /* Localization */
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
    console.log(this.props.location);

    /* URL paths */
    const pathToRegister = '/' + this.props.match.params.language + '/register/';
    const pathToForgotPassword = '/' + this.props.match.params.language + '/forgot-password/';

    return(
      <div id="login">
        <h2>{strings.login}</h2>
        <LoginForm language={this.props.match.params.language}/> 
        <div className="social-login-container">
          <h5>{strings.or}</h5>
          <SocialLogin/> 
        </div>
        
        <span>{strings.notRegisteredYet} </span>
        <Link tag={Link} to={pathToRegister}>
          {strings.registerNow}
        </Link>
        <br/>
        <Link tag={Link} to={pathToForgotPassword}>
          {strings.forgotpassword}
        </Link>
      </div>
    )
  }
}




export default Login;
