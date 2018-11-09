import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';
import styles from '../../../styles/login.css';
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
        doesntRegisteredYet:"Don't have registered yet?",
        registerNow:"Register now!"
      },
      fi: {
        forgotpassword:"Unohditko salasana?",
        login:"Kirjautuminen",
        doesntRegisteredYet:"Etkö ole vielä rekisteröitynyt?",
        registerNow:"Rekisteröidy nyt!"
      }
    });
    strings.setLanguage(this.props.match.params.language);

    /* URL paths */
    const pathToRegister = '/register/'+this.props.match.params.language
    const pathToForgotPassword = '/forgot-password/'+this.props.match.params.language

    return(
      <div id="login">
        <h2>{strings.login}</h2>
        <LoginForm language={this.props.match.params.language}/> <br/>
        <SocialLogin/> <br/>
        <div>{strings.doesntRegisteredYet}</div>
        <NavLink tag={Link} to={pathToRegister}>
          {strings.registerNow}
        </NavLink>
        <NavLink tag={Link} to={pathToForgotPassword}>
          {strings.forgotpassword}
        </NavLink>
      </div>
    )
  }
}




export default Login;
